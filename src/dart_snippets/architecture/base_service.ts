import * as _ from "lodash";
import { Base } from "./base";

export class BaseService extends Base {
  private _dartString: string;

  constructor(fileName: string, suffix?: string) {
    super(fileName, suffix);

    this._dartString = `import 'package:logger/logger.dart';

import '../logger.dart';

class BaseService {
  late Logger log;
  BaseService({String? title}) {
    log = getLogger(title ?? runtimeType.toString());
  }
}    
`;
  }

  get dartString(): string {
    return this._dartString;
  }
}
