// Archivo: controllers/Crud.js

// Importar Firebase o cualquier otra configuración necesaria
import { db } from '../firebase.js';
import { body, validationResult } from 'express-validator';


// Controlador para la vista de inicio
export const Vistainicio = async (req, res) => {
    try {
        const search = req.query.search || '';
        const itemsPerPage = parseInt(req.query.entries) || 5;
        const currentPage = parseInt(req.query.page) || 1;

        let query = db.collection('usuarios');
        
        // Filtrar por búsqueda si es necesario
        if (search) {
            query = query.where('name', '>=', search).where('name', '<=', search + '\uf8ff');
        }

        const totalUsersSnapshot = await query.get();
        const totalUsers = totalUsersSnapshot.size;
        const totalPages = Math.ceil(totalUsers / itemsPerPage);

        const usuariosSnapshot = await query
            .offset((currentPage - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .get();

        const usuarios = usuariosSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.render('Crud/inicio', { usuarios, currentPage, itemsPerPage, search, totalPages });
    } catch (error) {
        console.error("Error al cargar la lista de usuarios:", error);
        res.status(500).render('error', { message: 'Error al cargar la lista de usuarios. Por favor, intenta nuevamente más tarde.' });
    }
};


// Controlador para la vista de usuario
export const VistaUsuario = (req, res) => {
    res.render('Crud/Usuario');
};

// Controlador para la creación de usuarios
export const MostrarFormularioCrearUsuario = (req, res) => {
    res.render('Crud/crear'); // Asegúrate de que esta ruta renderice correctamente tu formulario
};

// Crear usuario
export const CrearUsuario = [
    body('name').trim().escape().notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('Debe ser un email válido').normalizeEmail(),
    body('password').trim().escape().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('Crud/crear', { 
                errors: errors.array(),
                csrfToken: req.csrfToken()
            });
        }

        try {
            const { name, email, password } = req.body;
            await db.collection('usuarios').add({ name, email, password });
            res.redirect('/inicio');
        } catch (error) {
            console.error("Error al crear un nuevo usuario:", error);
            res.status(500).render('error', { message: 'Error al crear un nuevo usuario. Por favor, intenta nuevamente más tarde.' });
        }
    }
];