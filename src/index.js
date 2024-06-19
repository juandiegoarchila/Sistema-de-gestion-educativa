import express from 'express';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import indexRoutes from './routes/Index.routes.js';
import expressLayouts from 'express-ejs-layouts';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';  // Asegúrate de importar cookie-parser

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configura el motor de vistas y la ruta base para las vistas
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Configura express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layouts/Layouts'); // Ruta al layout principal

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(join(__dirname, 'public')));

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());  // Asegúrate de usar cookie-parser antes del middleware CSRF

// Configuración de CSRF
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Pasar el token CSRF a todas las vistas
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

// Rutas principales
app.use('/', indexRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
