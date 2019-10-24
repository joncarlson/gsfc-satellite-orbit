import { Component, h, Host, Element } from '@stencil/core'
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three'

const CAMERA_FOV = 45
const CAMERA_ASPECT = window.innerWidth / window.innerHeight / window.innerWidth
const CAMERA_NEAR = 1
const CAMERA_FAR = 1000

@Component({
    tag: 'app-scene',
    styleUrl: 'app-scene.css',
    shadow: false,
})
export class AppScene {
    @Element() el: HTMLElement

    scene: Scene = new Scene()
    camera: PerspectiveCamera = new PerspectiveCamera(
        CAMERA_FOV,
        CAMERA_ASPECT,
        CAMERA_NEAR,
        CAMERA_FAR
    )
    renderer: WebGLRenderer = new WebGLRenderer({ antialias: true })

    componentDidLoad() {
        this.camera.position.set(0, 0, 10)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.el.appendChild(this.renderer.domElement)
    }

    render() {
        return <Host></Host>
    }
}
