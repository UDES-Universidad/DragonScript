import * as path from 'path';
import * as fse from 'fs-extra';

/**
 * Handle all file and directory operations.
 */
export default class FileHandler {
  /**
   *
   * @param steps {number}
   * @returns {string} directory name.
   */
  private static getNestedDir(steps: number): string {
    let dirName = '';

    for (let i = 1; i < steps; i++) {
      if (i === 1) {
        dirName = __dirname;
      } else {
        dirName = path.dirname(dirName);
      }
    }

    return dirName;
  }

  /**
   *
   * @returns Returns current directory.
   */
  public static DragonManagerDir(): string {
    return FileHandler.getNestedDir(5);
  }

  /**
   * Copy file.
   */
  public static async copyFile(
    src: string,
    dest: string,
    verbose = false
  ): Promise<boolean> {
    const fileName = path.basename(src);
    try {
      await fse.copyFile(src, dest, fse.constants.COPYFILE_EXCL);
      if (verbose) console.log(`COPY SUCCESS: File ${src} -> ${dest}`);
      return true;
    } catch (e: any) {
      if (verbose) console.log(e.message);
      return false;
    }
  }

  /**
   * Copy directories.
   */
  public static async copyDir(
    src: string,
    dest: string,
    verbose = false
  ): Promise<boolean> {
    try {
      fse.copy(src, dest);
      console.log(`$`);
      if (verbose) console.log(`COPY SUCCESS: ${src} -> ${dest}.`);
      return true;
    } catch (e: any) {
      if (verbose) console.log(e.message);
      return false;
    }
  }

  /**
   * Create a directory.
   */
  public static createDir(dir: string) {
    const dirExists = fse.existsSync(dir);

    if (!dirExists) fse.mkdirSync(dir, { recursive: true });
  }

  /**
   * Move files.
   */
  public static moveFile(src: string, dest: string) {
    const destDirName = path.dirname(dest);
    if (fse.existsSync(src) && destDirName) {
      fse.renameSync(src, dest);
    }
  }

  /**
   * Remove file or directory
   * @param src {string}
   */
  public static remove(src: string) {
    if (fse.existsSync(src)) {
      fse.removeSync(src);
    }
  }

  /**
   *
   * @param dir {string} Target directory
   * @returns {string []}: Array of files.
   */
  public static listDir(dir: string): string[] {
    if (fse.existsSync(dir)) {
      return fse.readdirSync(dir);
    } else {
      throw new Error('lisDir: Directory not exists.');
    }
  }

  public static readJSON(fileName: string) {
    return fse.readJsonSync(fileName, {
      encoding: 'utf-8',
      flag: 'string',
    });
  }

  public static writeJSON(fileName: string, data: { [keys: string]: any }) {
    fse.writeJSONSync(fileName, data, {
      spaces: 2,
    });
  }
}
