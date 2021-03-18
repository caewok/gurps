export class ResourceTrackerEditor extends Application {
  /**
   * Create a new Resource Tracker Editor
   * @param {Tracker} tracker data to update
   * @param {*} options
   */
  constructor(tracker, options = {}) {
    super(options)

    this._tracker = tracker
  }

  /**
   *
   * @param {*} actor
   * @param {*} path
   * @param {*} options
   */
  static editForActor(actor, path, options) {
    let tracker = getProperty(actor.data.data, path)
    let temp = JSON.stringify(tracker)
    let dialog = new ResourceTrackerEditor(JSON.parse(temp), options)
    dialog._updateTracker = async () => {
      let update = {}
      update[`data.${path}`] = dialog._tracker
      actor.update(update)
      dialog.close()
    }
    dialog.render(true)
  }

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: 'systems/gurps/templates/resource-editor-popup.html',
      width: 360,
      height: 468,
      popOut: true,
      minimizable: false,
      jQuery: true,
      resizable: false,
      title: 'Resource Tracker Editor',
    })
  }

  /** @override */
  getData(options) {
    const data = super.getData(options)
    data.tracker = this._tracker
    return data
  }

  /**
   * By default, do nothing. Each specific use will need its own update method.
   * @param {*} html
   */
  async _updateTracker(html) {}

  /** @override */
  activateListeners(html) {
    super.activateListeners(html)

    html.find('.name input').change(ev => {
      this._tracker.name = ev.currentTarget.value
    })

    html.find('.inputs .alias').change(ev => {
      this._tracker.alias = ev.currentTarget.value
    })

    html.find('.inputs .current').change(ev => {
      this._tracker.value = parseInt(ev.currentTarget.value)
    })

    html.find('.inputs .minimum').change(ev => {
      this._tracker.min = parseInt(ev.currentTarget.value)
    })

    html.find('.inputs .maximum').change(ev => {
      this._tracker.max = parseInt(ev.currentTarget.value)
    })

    html.find('#threshold-add').click(() => {
      if (!this._tracker.thresholds) {
        this._tracker.thresholds = []
      }

      this._tracker.thresholds.push({
        comparison: '>',
        operator: '×',
        value: 1,
        condition: 'Normal',
        color: '#FFFFFF',
      })
      this.render(true)
    })

    html.find('[name="delete-threshold"]').click(ev => {
      let index = $(ev.currentTarget).attr('data')
      this._tracker.thresholds.splice(index, 1)
      this.render(true)
    })

    html.find('[name="comparison"]').change(ev => {
      let index = $(ev.currentTarget).attr('data')
      this._tracker.thresholds[index].comparison = ev.currentTarget.value
    })

    html.find('[name="operator"]').change(ev => {
      let index = $(ev.currentTarget).attr('data')
      this._tracker.thresholds[index].operator = ev.currentTarget.value
    })

    html.find('[name="value"]').change(ev => {
      let index = $(ev.currentTarget).attr('data')
      this._tracker.thresholds[index].value = parseFloat(ev.currentTarget.value)
    })

    html.find('[name="condition"]').change(ev => {
      let index = $(ev.currentTarget).attr('data')
      this._tracker.thresholds[index].condition = ev.currentTarget.value
    })

    html.find('[name="color"]').change(ev => {
      let index = $(ev.currentTarget).attr('data')
      this._tracker.thresholds[index].color = ev.currentTarget.value
    })

    html.find('#update').click(() => this._updateTracker())
  }
}