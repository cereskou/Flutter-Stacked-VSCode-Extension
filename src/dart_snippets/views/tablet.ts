import * as _ from "lodash";
import { Base } from "../architecture/base";

export class Tablet extends Base {
  private _dartString: string;

  constructor(fileName: string, suffix: string) {
    super(fileName, suffix);

    let classPrefixList: string[] = this.className.split("Tablet");
    let classPrefix: string | undefined;
    if (!_.isEmpty(classPrefixList)) {
      classPrefix = _.first(classPrefixList);
    }

    this._dartString = `part of ${fileName}_view;

class _${this.className} extends StatelessWidget {
  final ${classPrefix}ViewModel model;

  const _${this.className} (this.model);

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('${this.className}'),
      ),
    );
  }
}
`;
  }

  get dartString(): string {
    return this._dartString;
  }
}
