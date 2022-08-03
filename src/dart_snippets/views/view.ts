import * as _ from "lodash";
import { Base } from "../architecture/base";
import { TYPE_OF_ARCHITECTURE } from "../../utils/utils";

export class View extends Base {
  private _dartString: string;

  constructor(
    fileName: string,
    suffix: string,
    typeOfArchitecture: TYPE_OF_ARCHITECTURE
  ) {
    super(fileName, suffix);

    let classPrefixList: string[] = this.className.split("View");
    let classPrefix: string | undefined;
    if (!_.isEmpty(classPrefixList)) {
      classPrefix = _.first(classPrefixList);
    }

    switch (typeOfArchitecture) {
      case TYPE_OF_ARCHITECTURE.Responsive:
        this._dartString = this.responsiveDartString(fileName, classPrefix);
        break;
      case TYPE_OF_ARCHITECTURE.Mobile:
        this._dartString = this.mobileDartString(fileName, classPrefix);
        break;
      default:
        this._dartString = this.mobileDartString(fileName, classPrefix);
        break;
    }
  }

  get dartString(): string {
    return this._dartString;
  }

  private mobileDartString(fileName: string, classPrefix?: string): string {
    return `import 'package:flutter/material.dart';
import 'package:stacked/stacked.dart';
import '${fileName}_view_model.dart';
          
class ${classPrefix}View extends StatelessWidget {
  const ${classPrefix}View({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ViewModelBuilder<${classPrefix}ViewModel>.reactive(
      builder: (BuildContext context, ${classPrefix}ViewModel model, Widget? _) {
        return Scaffold(
          appBar: AppBar(),
          body: const Center(
            child: Text('${classPrefix} View'),
          ),
        );
      },
      viewModelBuilder: () => ${classPrefix}ViewModel(),
    );
  }
}
`;
  }

  private responsiveDartString(fileName: string, classPrefix?: string): string {
    return `library ${fileName}_view;

import 'package:flutter/material.dart';
import 'package:stacked/stacked.dart';
import 'package:responsive_builder/responsive_builder.dart';
import '${fileName}_view_model.dart';

part '${fileName}_mobile.dart';
part '${fileName}_tablet.dart';
part '${fileName}_desktop.dart';

class ${this.className} extends StatelessWidget {
  const ${this.className}({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ViewModelBuilder<${classPrefix}ViewModel>.reactive(
      viewModelBuilder: () => ${classPrefix}ViewModel(),
      onModelReady: (model) {
        // Do something once your viewModel is initialized
      },
      builder: (BuildContext context, ${classPrefix}ViewModel model, Widget? child) {
        return ScreenTypeLayout(
          mobile: _${classPrefix}Mobile(model),
          desktop: _${classPrefix}Desktop(model),
          tablet: _${classPrefix}Tablet(model),  
        );
      }
    );
  }
}
`;
  }
}
