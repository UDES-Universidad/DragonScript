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
  public static async copyFile(src: string, dest: string, verbose=false): Promise<boolean> {
    const fileName = path.basename(src);
    try {
      await fse.copyFile(src, dest, fse.constants.COPYFILE_EXCL);
      if (verbose) console.log(`COPY SUCCESS: File ${src} -> ${dest}`);
      return true;
    } catch(e: any) {
      if (verbose) console.log(e.message);
      return false;
    }
  }

  /**
   * Copy directories.
   */
  public static async copyDir(src: string, dest: string, verbose=false): Promise<boolean> {
    try {  
      fse.copy(src, dest);
      console.log(`$`)
      if (verbose) console.log(`COPY SUCCESS: ${src} -> ${dest}.`);
      return true;
    } catch (e: any) {
      if (verbose) console.log(e.message);
      return false;
    }
  }
}
