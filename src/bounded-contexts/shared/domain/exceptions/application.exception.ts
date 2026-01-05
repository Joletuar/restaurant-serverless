import { RootException, RootExceptionsProps } from "./root.exception";

export type ApplicationExceptionProps = Pick<
  RootExceptionsProps,
  "message" | "errorCode"
>;

export class ApplicationException extends RootException {
  constructor(props: ApplicationExceptionProps) {
    const { message, errorCode } = props;

    super({
      layer: "Application",
      message,
      errorCode,
    });
  }
}
