import * as fs from 'fs-extra';

export const createFolder = (path: string) => fs.mkdirp(path);
