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
      
      // Исправлено: правильная замена с захватом всех символов, включая переносы строк
      // Используем флаг s (dotAll) в современном JS
      let updatedContent = content;
      
      // Вариант 1: Если окружение поддерживает флаг 's' (Node.js 8+)
      try {
        updatedContent = content.replace(/==(.*?)==/gs, '<highlight>$1</highlight>');
      } catch {
        // Вариант 2: Fallback для старых версий
        updatedContent = content.replace(/==([\s\S]*?)==/g, '<highlight>$1</highlight>');
      }
      
      // Вариант 3: Альтернативная замена на жирный шрифт (для сохранения TeX)
      // updatedContent = content.replace(/==([\s\S]*?)==/g, '**$1**');
      
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
    
    try {
      const items = readdirSync(currentPath);
      
      for (const item of items) {
        const itemPath = join(currentPath, item);
        const stats = statSync(itemPath);
        
        if (stats.isDirectory()) {
          processedCount += processFolder(itemPath);
        } else if (item.endsWith('.md')) {
          processedCount += processFile(itemPath);
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

// Получаем аргумент командной строки
const folderPath = process.argv[2];

if (!folderPath) {
  console.log('❌ Укажите путь к папке!');
  console.log('Использование: npx tsx script.ts <путь_к_папке>');
  console.log('Пример: npx tsx script.ts ./docs/lectures');
  console.log('Другой пример: npx tsx script.ts .');
  process.exit(1);
}

// Дополнительная проверка: поддержка относительных путей
const resolvedPath = join(process.cwd(), folderPath);
console.log(`📂 Будет обработана папка: ${resolvedPath}`);

replaceHighlight(folderPath);