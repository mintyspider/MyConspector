import os

# Укажите путь к папке (можно изменить)
folder_path = "docs\\disciplines\\6semester\\"

# Создаем основную папку, если ее нет
os.makedirs(folder_path, exist_ok=True)

# Создаем папки images и lectures
images_path = os.path.join(folder_path, "images")
lectures_path = os.path.join(folder_path, "lectures")

os.makedirs(images_path, exist_ok=True)
os.makedirs(lectures_path, exist_ok=True)

print(f"Создана папка: images")
print(f"Создана папка: lectures")

# Создаем 15 файлов
for i in range(1, 16):  # от 1 до 15 включительно
    file_name = f"{i}.md"  # без ведущих нулей!
    file_path = os.path.join(lectures_path, file_name)
    
    # Создаем файл
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(f"# {i}. ")
    
    print(f"Создан: {file_name}")

# Создаем index файл
index_path = os.path.join(folder_path, "index.md")
with open(index_path, 'w', encoding='utf-8') as f:
    f.write("# Index\n\n")
    for i in range(1, 16):
        f.write(f"- [{i}. ]({i}.md)\n")

print(f"\nСоздан: index.md")

print(f"\n✅ Готово! Создано:")
print(f"   - 2 папки: images, lectures")
print(f"   - 15 файлов от 1.md до 15.md")
print(f"   - index.md файл")
print(f"Путь: {os.path.abspath(folder_path)}")