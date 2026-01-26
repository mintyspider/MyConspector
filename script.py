import os

# Укажите путь к папке (можно изменить)
folder_path = ""

# Создаем папку, если ее нет
os.makedirs(folder_path, exist_ok=True)

# Создаем 48 файлов
for i in range(8, 49):  # от 1 до 48 включительно
    file_name = f"{i}.md"  # без ведущих нулей!
    file_path = os.path.join(folder_path, file_name)
    
    # Создаем файл
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(f"# {i}. ")
    
    print(f"Создан: {file_name}")

print(f"\n✅ Готово! Создано 48 файлов в папке: {os.path.abspath(folder_path)}")