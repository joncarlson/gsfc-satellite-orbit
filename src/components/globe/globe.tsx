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
    Object3D,
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
    objects: Object3D
    earthVector: Vector3

    componentDidLoad() {
        this.scene = new Scene()
        this.objects = new Object3D()
        this.earthVector = new Vector3(0, 0, 0)

        this.scene.add(this.objects)

        this.addCamera()
        this.addRenderer()
        this.addAmbientLight()
        this.addDirectionalLight()
        this.addEarth()
        this.addSatellite()

        this.startRenderLoop()
    }

    addCamera() {
        this.camera = new PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            1,
            2000
        )
        this.camera.position.set(0, 35, 30)
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
        let earth = new Mesh(geometry, material)

        this.objects.add(earth)
    }

    addSatellite() {
        let texture = new TextureLoader().load('/assets/images/earth.jpg')
        let geometry = new SphereGeometry(0.5, 50, 50)
        let material = new MeshPhongMaterial({
            map: texture,
            color: 0xf2f2f2,
            specular: 0xbbbbbb,
            shininess: 2,
        })
        let satellite = new Mesh(geometry, material)

        this.objects.add(satellite)

        this.placeObjectOnPlanet(satellite, -56.50928276, 40.5627175)
    }

    placeObjectOnPlanet(object, lat, lon, radius = 10) {
        var latRad = lat * (Math.PI / 180)
        var lonRad = -lon * (Math.PI / 180)

        object.position.set(
            Math.cos(latRad) * Math.cos(lonRad) * radius + 5,
            Math.sin(latRad) * radius,
            Math.cos(latRad) * Math.sin(lonRad) * radius
        )

        object.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5)
    }

    startRenderLoop() {
        //let r = 35
        //let theta = 0
        //let dTheta = 2 * Math.PI / 1000
        //let dx = .01
        //let dy = -.01
        //let dz = -.05

        let render = () => {
            this.objects.rotation.x += 0.009
            this.objects.rotation.y += 0.009

            /*
            if (this.camera.position.z < 0) {
                dx *= -1
            }

            //this.camera.position.x += dx
            //this.camera.position.y += dy
            //this.camera.position.z += dz
            this.camera.lookAt(this.earthVector)
            
            //Flyby reset
            if (this.camera.position.z < -100) {
                this.camera.position.set(0,35,70)
            }*/
            this.camera.lookAt(this.earthVector)
            this.renderer.render(this.scene, this.camera)
            requestAnimationFrame(render)
        }

        render()
    }

    render() {
        // TODO: move threejs calls to a store/service, then we can actually decouple the components instead of using events
        return (
            <Host>
                <gd-satellite
                    norad-id="23940"
                    name="TOMS EP"
                    on-found-position={e =>
                        console.log('found positon ', e.detail)
                    }
                />
            </Host>
        )
    }
}
