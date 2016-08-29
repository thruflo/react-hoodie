const { Children, Component, PropTypes } = require('react')

const hoodieShape = PropTypes.shape({
  store: PropTypes.func.isRequired,
  bind: PropTypes.func.isRequired,
  bindAll: PropTypes.func.isRequired
})

class Provider extends Component {
  getChildContext () {
    return { hoodie: this.props.hoodie }
  }
  render () {
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

exports.Provider = Provider
