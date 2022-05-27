import * as _ from "lodash";
import { Base } from "./base";

export class Main extends Base {
  private _dartString: string;

  constructor(fileName: string, initialRouteName: string, suffix?: string) {
    super(fileName, suffix);

    this._dartString = `import 'package:flutter/material.dart';
import 'package:stacked_services/stacked_services.dart';
    
import 'core/locator.dart';
import 'core/router_constants.dart';
import 'core/router.dart' as router;
    
void main() async {
  await LocatorInjector.setUpLocator();
  runApp(const MyApp());
}
    
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: StackedService.navigatorKey,
      onGenerateRoute: router.Router.generateRoute,
      initialRoute: ${initialRouteName}ViewRoute,
    );
  }
}
`;
  }

  get dartString(): string {
    return this._dartString;
  }
}
