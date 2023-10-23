# Aplicación de Gestion de proyectos con React y Javascript

Una sencilla aplicación TODO desarrollada con React y Javascript. La aplicación utiliza JSON-Server para persistir los datos de las tareas. Enfocado para el uso en pedidos en el "Buen Sabor"

## Características

- Agregar pedidos
- Moverlas de estado a "Por hacer", "En progreso", "Realizadas"
- Eliminar tareas de la lista.
- Persistencia de datos utilizando JSON-Server.

## Requisitos previos

Asegúrate de tener Node.js y npm instalados en tu sistema antes de continuar.

## Tecnologías utilizadas

- React: Para construir la interfaz de usuario y gestionar el estado de la aplicación.
- JavaScript: Para la lógica del lado del cliente.
- json-server: Para simular una API REST y permitir la persistencia de datos en formato JSON.

## Instrucciones de Uso

1. Clona el repositorio:

```
git clone https://github.com/lucascardone/TODO-app
```
2. Navega al directorio del proyecto:
```
cd todo-app
```
3. Instala las dependencias:
```
npm install
```
4. Inicia el servidor json-server:
```
json-server --watch db.json
```
5. Inicia la aplicación React:
```
npm run dev
```

