import { Component, h, Host, Element } from '@stencil/core'
import { threeService } from '../../services/three-service'

@Component({
    tag: 'gd-globe',
    shadow: false,
})
export class Globe {
    @Element() el: HTMLElement

    componentDidLoad() {
        threeService.appendRendererToElement(this.el)
    }

    render() {
        return <Host />
    }
}
