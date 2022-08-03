import _ = require("lodash");
import * as path from "path";
import { Base } from "./base";
import { FileSystemManager } from "../../utils/file_system_manager";
import { IRouteObject } from "../../utils/router_json";
import { VsCodeActions } from "../../utils/vs_code_actions";
import { TYPE_OF_ROUTE } from "../../utils/utils";

export class Router extends Base {
  private _dartString: string;
  private _customRoute: boolean;
  private initialPath: string;

  constructor(
    fileName: string,
    private routes: Array<IRouteObject>,
    suffix?: string
  ) {
    super(fileName, suffix);
    this.initialPath = suffix === undefined ? "../../" : `package:${suffix}`;
    this._dartString = "// [ This is an auto generated file ]\n\n";
    this._dartString += `import 'package:flutter/material.dart';
import '${this.initialPath}/core/router_constants.dart';\n`;
    this._customRoute = false;
  }

  public create() {
    let _importString = "";
    this.routes.forEach((value, index) => {
      this._dartString += `import '${this.initialPath}/${value.file_path}' as view${index};\n`;
      if (value.transition === "CustomPageRoute") {
        this._customRoute = true;
      }
    });
    if (this._customRoute) {
      this._dartString += `import '${this.initialPath}/core/router_custom.dart';\n`;
    }
    this._dartString += `\n`;
    this._dartString += _importString;

    this._dartString += `\nclass Router {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {\n`;

    this.routes.forEach((value, index) => {
      this._dartString += `      case ${this.lowerCamelCased(
        value.route_name
      )}:\n`;
      this._dartString += `        return ${value.transition}(builder: (_) => const view${index}.${value.view_name}(), settings: settings);\n`;
    });

    this._dartString += `      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for \${settings.name}'),
            ),
          ),
        );
    }
  }
}`;

    const root_path = VsCodeActions.rootPath;
    const json_path = path.join(root_path, "lib", "core");
    FileSystemManager.createFile(json_path, "router.dart", this._dartString);
    if (this._customRoute) {
      let _customString = `import 'package:flutter/material.dart';
import 'router.dart' as router;

typedef ValueCallback = void Function(dynamic);
      
class CustomPageRoute extends MaterialPageRoute {
  CustomPageRoute({builder, settings})
      : super(builder: builder, settings: settings);

  @override
  Duration get transitionDuration => Duration.zero;
}

class CustomRouter {
  static void push(BuildContext context, String name,
      {Object? arguments, ValueCallback? finished}) {
    Navigator.push(
      context,
      router.Router.generateRoute(
          RouteSettings(name: name, arguments: arguments)),
    ).then((value) {
      if (finished != null) finished(value);
    }, onError: (e) {
      throw e;
    });
  }
}
`;
      FileSystemManager.createFile(
        json_path,
        "router_custom.dart",
        _customString
      );
    }
  }

  private lowerCamelCased(value: string): string {
    return _.camelCase(value);
  }
}
