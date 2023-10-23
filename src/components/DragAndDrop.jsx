import { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";


export const DragAndDrop = () => {

    const [tasks, setTasks] = useState();
    const [loading, setLoading] = useState(true);
    //Para el modal (agregar)
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", body: "", img: "", list: 1 });

    useEffect(() => {
        fetch("http://localhost:3000/pedidos")
            .then((response) => response.json())
            .then((data) => {
                setTasks(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    const getList = (list) => {
        return tasks.filter(item => item.list === list)
    }

    const startDrag = (evt, item) => {
        evt.dataTransfer.setData('itemID', item.id)
    }

    const draggingOver = (evt) => {
        evt.preventDefault();
    }

    const onDrop = (evt, list) => {
        const itemID = evt.dataTransfer.getData("itemID");
        const item = tasks.find((task) => task.id == itemID);

        // Actualiza la lista de la tarea en el cliente
        item.list = list;

        // Realiza una solicitud PUT a JSON Server para actualizar el pedido en el servidor
        fetch(`http://localhost:3000/pedidos/${item.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
        })
            .then((response) => response.json())
            .then((updatedItem) => {
                // Actualiza el estado con la respuesta del servidor
                const updatedTasks = tasks.map((task) =>
                    task.id === updatedItem.id ? updatedItem : task
                );
                setTasks(updatedTasks);
            })
            .catch((error) => {
                console.error("Error updating data:", error);
            });
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleAddTask = () => {
        fetch("http://localhost:3000/pedidos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
        })
            .then((response) => response.json())
            .then((createdTask) => {
                // Actualiza el estado con la nueva tarea
                setTasks([...tasks, createdTask]);
            })
            .catch((error) => {
                console.error("Error adding data:", error);
            });

        // Cierra el modal
        handleCloseModal();
    };

    const handleDeleteTask = (id) => {
        // Realiza una solicitud DELETE a JSON Server para eliminar el pedido
        const itemID = id.dataTransfer.getData("itemID");
        const item = tasks.find((task) => task.id == itemID);
      
        fetch(`http://localhost:3000/pedidos/${item.id}`, {
          method: "DELETE",
        })
          .then(() => {
            // Después de eliminar el pedido en el servidor, obtén la lista actualizada
            fetch("http://localhost:3000/pedidos")
              .then((response) => response.json())
              .then((data) => {
                // Actualiza el estado con la lista de pedidos actualizada
                setTasks(data);
              })
              .catch((error) => {
                console.error("Error fetching updated data:", error);
              });
          })
          .catch((error) => {
            console.error("Error deleting data:", error);
          });
      };
      

    return (
        <>
            <h1>
                Gestion de proyectos
            </h1>
            <br />
            <div className="drag-and-drop">
                <div className="column column--1">
                    <h3>
                        Tareas por hacer
                    </h3>
                    <div className="dd-zone" droppable="true" onDragOver={(evt) => draggingOver(evt)} onDrop={(evt) => onDrop(evt, 1)}>
                        <Button variant="primary" onClick={handleShowModal}>
                            Agregar Pedido
                        </Button>
                        {getList(1).map(item => (
                            <div className="dd-element" key={item.id} draggable onDragStart={(evt) => startDrag(evt, item)}>
                                <img src={item.img}/>
                                <b className="title">{item.title}</b>
                                <p className="body">{item.body}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="column column--2">
                    <h3>
                        Tareas en progreso
                    </h3>
                    <div className="dd-zone" droppable="true" onDragOver={(evt) => draggingOver(evt)} onDrop={(evt) => onDrop(evt, 2)}>
                        {getList(2).map(item => (
                            <div className="dd-element" key={item.id} draggable onDragStart={(evt) => startDrag(evt, item)}>
                                <img src={item.img}/>
                                <b className="title">{item.title}</b>
                                <p className="body">{item.body}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="column column--3">
                    <h3>
                        Tareas realizadas
                    </h3>
                    <div className="dd-zone" droppable="true" onDragOver={(evt) => draggingOver(evt)} onDrop={(evt) => onDrop(evt, 3)}>
                        {getList(3).map(item => (
                            <div className="dd-element" key={item.id} draggable onDragStart={(evt) => startDrag(evt, item)}>
                                <img src={item.img}/>
                                <b className="title">{item.title}</b>
                                <p className="body">{item.body}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="column column--trash">
                    <h3>Eliminar Pedidos</h3>
                    <div
                        className="dd-zone"
                        droppable="true"
                        onDragOver={(evt) => draggingOver(evt)}
                        onDrop={(evt) => handleDeleteTask(evt)}
                    >
                        Arrastra y suelta aquí para eliminar
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="title">
                            <Form.Label>Título</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Título del pedido"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="body">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Descripción del pedido"
                                value={newTask.body}
                                onChange={(e) => setNewTask({ ...newTask, body: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="img">
                            <Form.Label>Imagen (URL)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="URL de la imagen"
                                value={newTask.img}
                                onChange={(e) => setNewTask({ ...newTask, img: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleAddTask}>
                        Agregar Pedido
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}