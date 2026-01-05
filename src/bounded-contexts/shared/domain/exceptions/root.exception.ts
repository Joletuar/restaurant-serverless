import { ErrorCode } from "../error-code.enum";

export type RootExceptionsProps = {
  layer: string;
  message: string;
  errorCode?: ErrorCode;
};

export abstract class RootException {
  layer: string;
  message: string;
  errorCode: ErrorCode;

  constructor(props: RootExceptionsProps) {
    const { layer, message, errorCode = ErrorCode.DEFAULT_ERROR_CODE } = props;

    this.layer = layer;
    this.message = message;
    this.errorCode = errorCode;
  }
}
