import * as _ from "lodash";
import { Base } from "../architecture/base";

export class Mobile extends Base {
  private _dartString: string;

  constructor(fileName: string, suffix: string) {
    super(fileName, suffix);

    this._dartString = `part of ${fileName}_widget;

class _${this.className} extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text('${fileName}_mobile'),
    );
  }
}`;
  }

  get dartString(): string {
    return this._dartString;
  }
}
