import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'fs';
import { join } from 'path';

const replaceHighlight = (folderPath: string): void => {
  if (!existsSync(folderPath)) {
    console.error(`❌ Папка не существует: ${folderPath}`);
    return;
  }

  console.log(`🔍 Поиск файлов в: ${folderPath}`);
  
  const processFile = (filePath: string) => {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const updatedContent = content.replace(/==([^=]+)==/g, '<highlight>$1</highlight>');
      
      if (content !== updatedContent) {
        writeFileSync(filePath, updatedContent, 'utf-8');
        console.log(`✓ Обработан: ${filePath}`);
        return 1;
      }
    } catch (error) {
      console.error(`❌ Ошибка: ${filePath}`, error);
    }
    return 0;
  };

  const processFolder = (currentPath: string): number => {
    let processedCount = 0;
    const items = readdirSync(currentPath);
    
    items.forEach(item => {
      const itemPath = join(currentPath, item);
      const stats = statSync(itemPath);
      
      if (stats.isDirectory()) {
        processedCount += processFolder(itemPath);
      } else if (item.endsWith('.md')) {
        processedCount += processFile(itemPath);
      }
    });
    
    return processedCount;
  };

  const totalProcessed = processFolder(folderPath);
  console.log(`\n✅ Обработано файлов: ${totalProcessed}`);
  console.log(`📁 Папка: ${folderPath}`);
};

// Получаем аргумент командной строки
const folderPath = process.argv[2];

if (!folderPath) {
  console.log('❌ Укажите путь к папке!');
  console.log('Использование: npx tsx script.ts <путь_к_папке>');
  console.log('Пример: npx tsx script.ts ./docs/lectures');
  process.exit(1);
}

replaceHighlight(folderPath);