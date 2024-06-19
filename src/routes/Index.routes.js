// Archivo: routes/Index.routes.js

import { Router } from 'express';
import { Vistainicio, VistaUsuario, CrearUsuario, MostrarFormularioCrearUsuario } from '../controllers/Crud.js';

const router = Router();

router.get("/inicio", Vistainicio); // Vista de inicio
router.get("/crear", MostrarFormularioCrearUsuario); // Mostrar formulario de creación de usuarios
router.post("/crear", CrearUsuario); // Ruta para la creación de usuarios

export default router;
