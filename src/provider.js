import { Children, Component, PropTypes } from 'react'

const hoodieShape = PropTypes.shape({
  store: PropTypes.func.isRequired,
  bind: PropTypes.func.isRequired,
  bindAll: PropTypes.func.isRequired
})

class Provider extends Component {
  constructor (props, context) {
    super(props, context)
    this.hoodie = props.hoodie
  }
  getChildContext () {
    return { hoodie: this.hoodie }
  }
  render() {
    const { children } = this.props
    return Children.only(children)
  }
}

Provider.propTypes = {
  hoodie: hoodieShape.isRequired,
  children: PropTypes.element.isRequired
}
Provider.childContextTypes = {
  hoodie: hoodieShape.isRequired
}

export default Provider
