import { RootException, RootExceptionsProps } from "./root.exception";

export type DomainExceptionProps = Pick<
  RootExceptionsProps,
  "message" | "errorCode"
>;

export class DomainException extends RootException {
  constructor(props: DomainExceptionProps) {
    const { message, errorCode } = props;

    super({
      layer: "Domain",
      message,
      errorCode,
    });
  }
}
