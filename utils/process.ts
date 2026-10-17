// Запускаем файл командой: npx tsx process.ts <полный путь>

import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ALLOWED_EXT = ['.md', '.markdown', '.mdx', '.txt'];

const replaceHighlight = (folderPath: string): void => {
  if (!existsSync(folderPath)) {
    console.error(`❌ Папка не существует: ${folderPath}`);
    return;
  }

  console.log(`🔍 Поиск файлов в: ${folderPath}`);

  const processFile = (filePath: string): number => {
    try {
      const content = readFileSync(filePath, 'utf-8');

      // Разбиваем на код-блоки ```...``` и inline `...`, чтобы их не трогать
      const parts = content.split(/(```[\s\S]*?```|`[^`]*`)/g);
      const updatedContent = parts
        .map((part, i) =>
          i % 2 === 1
            ? part
            : part.replace(/==([\s\S]*?)==/g, '<highlight>$1</highlight>')
        )
        .join('');

      if (content !== updatedContent) {
        writeFileSync(filePath, updatedContent, 'utf-8');
        console.log(`✓ Обработан: ${filePath}`);
        return 1;
      } else {
        console.log(`· Без изменений: ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Ошибка: ${filePath}`, error);
    }
    return 0;
  };

  const processFolder = (currentPath: string): number => {
    let processedCount = 0;
    try {
      const items = readdirSync(currentPath);
      for (const item of items) {
        const itemPath = join(currentPath, item);
        let stats;
        try {
          stats = statSync(itemPath);
        } catch {
          continue;
        }

        if (stats.isDirectory()) {
          processedCount += processFolder(itemPath);
        } else {
          const lower = item.toLowerCase();
          if (ALLOWED_EXT.some((ext) => lower.endsWith(ext))) {
            processedCount += processFile(itemPath);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Ошибка при чтении папки ${currentPath}:`, error);
    }
    return processedCount;
  };

  const totalProcessed = processFolder(folderPath);
  console.log(`\n✅ Обработано файлов: ${totalProcessed}`);
  console.log(`📁 Папка: ${folderPath}`);
};

const folderPath = process.argv[2];
if (!folderPath) {
  console.log('❌ Укажите путь к папке!');
  console.log('Использование: npx tsx process.ts <путь_к_папке>');
  process.exit(1);
}

const resolvedPath = resolve(process.cwd(), folderPath);
console.log(`📂 Будет обработана папка: ${resolvedPath}`);
replaceHighlight(resolvedPath);