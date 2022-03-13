import { readdirSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import multer from "multer";
import express from "express";
import dotenv from "dotenv";

const picturePath = resolve( process.cwd(), "pictures" );
if ( !existsSync( picturePath ) ) {
    mkdirSync( picturePath );
}

dotenv.config( {
    path: resolve( process.cwd(), "..", ".env.development" )
} );

const storage = multer.diskStorage( {
    destination( req, file, callback ) {
        callback( null, "pictures" );
    },
    filename( req, file, callback ) {
        callback( null, file.fieldname );
    }
} );
const upload = multer( { storage } );

const app = express();
app.use( express.static( "pictures" ) );
app.all( "*", ( req, res, next ) => {
    res.header( "Access-Control-Allow-Origin", "*" );
    res.header( "Access-Control-Allow-Headers", "X-Requested-With" );
    res.header( "Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS" );
    res.header( "X-Powered-By","3.2.1" );
    res.header( "Content-Type", "application/json;charset=utf-8" );
    next();
} );

app.post( "/upload", upload.any(), ( req, res ) => {
    res.status( 200 ).send( { message: "上传成功" } );
} );

app.get( "/pic", ( req, res ) => {
    const names = readdirSync( "./pictures" );
    res.status( 200 ).send( names );
} );

app.listen( process.env.VITE_API_PORT, process.env.VITE_HOST, () => {
    console.log( `端口监听完成: ${ process.env.VITE_API_PORT }` )
} );