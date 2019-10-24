import { Component, h, Host, Element } from '@stencil/core'
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    AmbientLight,
    DirectionalLight,
    SphereGeometry,
    MeshPhongMaterial,
    Mesh,
    TextureLoader,
    Vector3,
} from 'three'

@Component({
    tag: 'gd-globe',
    shadow: false,
})
export class Globe {
    @Element() el: HTMLElement

    scene: Scene
    camera: PerspectiveCamera
    renderer: WebGLRenderer
    earth: Mesh
    earthVector: Vector3

    componentDidLoad() {
        this.scene = new Scene()
        this.earthVector = new Vector3(0, 0, 0)

        this.addCamera()
        this.addRenderer()
        this.addAmbientLight()
        this.addDirectionalLight()
        this.addEarth()

        this.startRenderLoop()
    }

    addCamera() {
        this.camera = new PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            1,
            2000
        )
        this.camera.position.set(0, 35, 10)
        this.scene.add(this.camera)
    }

    addRenderer() {
        this.renderer = new WebGLRenderer({ antialias: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.el.appendChild(this.renderer.domElement)
    }

    addAmbientLight() {
        let light = new AmbientLight(0xf1f1f1)
        this.scene.add(light)
    }

    addDirectionalLight() {
        let light = new DirectionalLight(0xffffff, 1)
        light.position.set(50, 50, 50)
        this.scene.add(light)
    }

    addEarth() {
        let texture = new TextureLoader().load('/assets/images/earth.jpg')
        let geometry = new SphereGeometry(10, 500, 50)
        let material = new MeshPhongMaterial({
            map: texture,
            color: 0xf2f2f2,
            specular: 0xbbbbbb,
            shininess: 2,
        })
        this.earth = new Mesh(geometry, material)
        this.scene.add(this.earth)
    }

    startRenderLoop() {
        //let dx = .01
        //let dy = -.01

        let render = () => {
            this.earth.rotation.x += 0.0009
            this.earth.rotation.y += 0.0009

            //this.camera.position.x += dx
            //this.camera.position.y += dy

            this.camera.lookAt(this.earthVector)
            this.renderer.render(this.scene, this.camera)
            requestAnimationFrame(render)
        }

        render()
    }

    render() {
        return (
            <Host>
                <slot />
            </Host>
        )
    }
}
