import express, {Request, Response} from "express";
import mysql from "mysql2/promise";
import path from "path";

const app = express();

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use(express.static(path.join(__dirname, "/public")));

const connection = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mudar123",
    database: "unicesumar"
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/', function(req:Request, res:Response){
    return res.render('users/paginaInicial')
});

app.get('/users', async function (req: Request, res: Response) {
    const [rows] = await connection.query("SELECT id, name, email, papel, DATE_FORMAT(created_at, '%d/%m/%Y') AS dataFormatada FROM categories;");
    return res.render('users/usuarios', {
        categories: rows
    });
});


app.get('/login', async function(req: Request, res: Response){
    return res.render('users/login');
});

app.post('/login', async function(req: Request, res: Response) {
    const { email, senha } = req.body; 
    const sqlLogin = "SELECT * FROM categories WHERE email = ? AND senha = ?";
    
        const [rows] = await connection.query(sqlLogin, [email, senha]); 
        if (Array.isArray(rows) && rows.length > 0) {
            
            res.redirect('/users'); 
        } else {
           res.render('users/login',{errorMessage:'Email ou senha incorretos.'}); 
           
        }

});


app.post('/users', async function (req:Request, res:Response) {
    const reqBody=req.body;
    const sqlQuery="INSERT INTO categories(name, email, senha, papel) VALUES (?, ?, ?, ?)";
    await connection.query(sqlQuery, [reqBody.nome, reqBody.email, reqBody.senha, reqBody.papel ]);
    return res.redirect('/users');
});


app.post('/users/:id/delete', async function(req:Request, res:Response){
    const id=req.params;
    const sqlQuery="DELETE FROM categories WHERE id=?";
    await connection.query(sqlQuery, [id.id]);
    return res.redirect('/users');
});

app.get('/users/add', function(req:Request, res:Response){
    return res.render('users/cadastro');
}); 



app.listen('3000', () => console.log("Server is listening on port 3000"));