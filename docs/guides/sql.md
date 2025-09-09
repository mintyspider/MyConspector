# 📌 Шпаргалка по основным SQL-запросам

1. `SELECT`  

Выбрать все данные из таблицы:  
```sql
SELECT * FROM users;
Выбрать только имена:
SELECT name FROM users;
```

2. `WHERE`

Фильтрация по условию:
```sql
SELECT * FROM users WHERE age > 18;
```

3. `LIMIT`

Ограничение количества строк в выводе:
```sql
SELECT * FROM users WHERE age > 18 LIMIT 5;
```

4. `ORDER BY`

Сортировка по возрастанию / убыванию:
```sql
SELECT * FROM users ORDER BY age ASC; -- по возрастанию
SELECT * FROM users ORDER BY age DESC; -- по убыванию
```

5. `UPDATE`

Обновить запись:
```sql
UPDATE users SET age = 20 WHERE name = 'Lenya';
```

6. `DELETE`

Удалить запись:
```sql
DELETE FROM users WHERE name = 'Petya';
```

7. `INSERT`

Добавить новую запись:
```sql
INSERT INTO users (name) VALUES ('Sanya');
```
8. `LIKE` (поиск по шаблону)
```sql
SELECT * FROM users WHERE name LIKE 'S%'; -- начинается с S
SELECT * FROM users WHERE name LIKE '%a'; -- заканчивается на a
SELECT * FROM users WHERE name LIKE '%an%'; -- содержит 'an'
```

9. `BETWEEN` (диапазон)
```sql
SELECT * FROM users WHERE age BETWEEN 18 AND 25;
```

10. `DISTINCT` (уникальные значения)
```sql
SELECT DISTINCT name FROM users;
```

11. `COUNT / AVG / MIN / MAX`
```sql
SELECT COUNT(*) FROM users; -- количество
SELECT AVG(age) FROM users; -- средний возраст
SELECT MIN(age) FROM users; -- минимальный возраст
SELECT MAX(age) FROM users; -- максимальный возраст
```

12. `GROUP BY + HAVING`

Группировка с условием:
```sql
SELECT age, COUNT(*) 
FROM users 
GROUP BY age 
HAVING COUNT(*) > 1;
```