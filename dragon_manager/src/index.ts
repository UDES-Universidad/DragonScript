#!/usr/bin/env node

import FileHandler from "./modules/files";

const hello = "Hello, UDES!";

const copyFile = FileHandler.copyFile(
    '/home/sit/Descargas/VacanteUDES.jpeg', 
    '/home/sit/Descargas/VacanteUDES3.jpeg', 
    true
);

copyFile.then((r) => console.log(r)).catch((e) => console.log(e));

const copyDir = FileHandler.copyDir(
    '/home/sit/Descargas/test',
    '/home/sit/Descargas/test2',
    true,
)

