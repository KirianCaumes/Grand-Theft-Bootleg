import BootlegController from "../controllers/bootleg.controller.ts"
import DefaultController from "../controllers/default.controller.ts"
import BootlegService from "../services/bootlegService.ts"

//Services
const bootlegService = new BootlegService()

//Controllers
const bootlegController = new BootlegController(bootlegService)
const defaultController = new DefaultController()

export {
    bootlegService,
    bootlegController,
    defaultController
}