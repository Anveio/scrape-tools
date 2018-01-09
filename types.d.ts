interface ChanFileDestination extends ChanThreadMetaData {
  readonly filename: string;
}

interface ChanThreadMetaData {
  readonly board: string;
  readonly thread: string;
}

interface ChanFileData {
  readonly src: string;
  readonly metadata: ChanFileDestination;
}