import express from "express"
const router = express.Router();
import { jsonResponse } from "../lib/jsonResponse.mjs";
import User from "../schema/user.mjs";
import getUserInfo from "../lib/getUserInfo.mjs";

router.post("/", async (req, res) => {

    const { username, password } = req.body;

    if (!!!username || !!!password) {
        return res.status(400).json(jsonResponse(400, {
            error: "archivos son requeridos"
        }));
    }
    //autenticar usuario

    const user = await User.findOne({ username });

    if (user) {
        const correctPassword = await user.comparePassword(password, user.password);

        if (correctPassword) {
            const accessToken = user.createAccessToken();
            const refreshToken = await user.createRefreshToken();

            res.status(200)
                .json(
                    jsonResponse(200, {
                        user: getUserInfo(user),
                        accessToken,
                        refreshToken
            }));
        } else {
            res.status(400)
                .json(
                    jsonResponse(400, {
                        error: "Usuario o contraseña incorrectos"
            }))
        }
    } else {
        res.status(400).json(jsonResponse(400, {
            error: "Usuario no encontrado"
        }))
    }
});

export default router;