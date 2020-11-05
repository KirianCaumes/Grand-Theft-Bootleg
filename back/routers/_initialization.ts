import BandController from "../controllers/band.controller.ts"
import BootlegController from "../controllers/bootleg.controller.ts"
import DefaultController from "../controllers/default.controller.ts"
import SongController from "../controllers/song.controller.ts"
import { BootlegsCollection } from "../models/bootleg.model.ts"
import { bootlegValidator } from "../validators/bootleg.validator.ts"
import UserController from "../controllers/user.controller.ts"
import { UsersCollection } from "../models/user.model.ts"
import { userValidator } from "../validators/user.validator.ts"
import { reportValidator } from "../validators/report.validator.ts"

//Collection
const bootlegsCollection = new BootlegsCollection()
const usersCollection = new UsersCollection()

//Controllers
const bootlegController = new BootlegController(bootlegsCollection, bootlegValidator, reportValidator)
const bandController = new BandController(bootlegsCollection)
const songController = new SongController(bootlegsCollection)
const userController = new UserController(usersCollection, userValidator)
const defaultController = new DefaultController()

export {
    bootlegController,
    bandController,
    songController,
    userController,
    defaultController
}