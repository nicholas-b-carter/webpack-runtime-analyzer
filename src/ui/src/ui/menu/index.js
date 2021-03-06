var Value = require('basis.data').Value;
var resolveValue = require('basis.data').resolveValue;
var event = require('basis.event');
var Node = require('basis.ui').Node;
var Popup = require('basis.ui.popup').Popup;

var Menu = Node.subclass({
    template: resource('./template/menu.tmpl'),
    selection: true,
    childFactory: function(config) {
        return new MenuItem(config);
    },
    binding: {
        footer: 'satellite:'
    }
});

var MenuItem = Node.subclass({
    template: resource('./template/item.tmpl'),
    type: 'normal',
    typeRA_: null,
    checked: false,
    checkedRA_: null,
    counter: 0,
    counterRA_: null,
    visible: true,
    visibleRA_: null,
    emit_typeChanged: event.create('typeChanged'),
    emit_checkedChanged: event.create('checkedChanged'),
    emit_counterChanged: event.create('counterChanged'),
    emit_visibleChanged: event.create('visibleChanged'),
    propertyDescriptors: {
        type: 'typeChanged',
        checked: 'checkedChanged',
        counter: 'counterChanged',
        visible: 'visibleChanged'
    },
    action: {
        click: function(e) {
            switch (this.type) {
                case 'dropdown':
                    this.satellite.dropdown.show(this.element);
                    break;
                case 'checkbox':
                    this.setChecked(!this.checked);
                    this.toggle(e);
                    this.parentNode.owner.hide();
                    break;
                case 'radio':
                    if (this.checked) {
                        this.setChecked(true);
                        this.toggle(e);
                        this.parentNode.owner.hide();
                    }
                    break;
                default:
                    this.select();
            }
        }
    },
    satellite: {
        dropdown: {
            instance: Popup.subclass({
                template: resource('./template/popup.tmpl'),
                dir: 'left bottom left top',
                autorotate: true,
                hideOnKey: basis.fn.$true,
                satellite: {
                    menu: {
                        instance: Menu.subclass({
                            template: resource('./template/sub-menu.tmpl')
                        }),
                        config: function(owner) {
                            return {
                                childNodes: owner.items
                            };
                        }
                    }
                },
                binding: {
                    menu: 'satellite:'
                }
            }),
            existsIf: function(owner) {
                return owner.type == 'dropdown'
            },
            config: function(owner) {
                return {
                    items: owner.items,
                    dir: owner.dir || 'left bottom left top'
                };
            }
        }
    },
    binding: {
        id: 'id',
        type: {
            events: 'typeChanged',
            getter: basis.getter('type')
        },
        isCheckbox: function(node) {
            return node.type == 'checkbox' || node.type == 'radio';
        },
        checked: {
            events: 'checkedChanged',
            getter: basis.getter('checked')
        },
        counter: {
            events: 'counterChanged',
            getter: basis.getter('counter')
        },
        visible: {
            events: 'visibleChanged',
            getter: basis.getter('visible')
        },
        subMenuOpened: Value.query('satellite.dropdown.visible')
    },
    init: function() {
        Node.prototype.init.call(this);

        this.setType(this.type);
        this.setChecked(this.checked);
        this.setCounter(this.counter);
        this.setVisible(this.visible);
    },
    toggle: basis.fn.$undef,
    setType: function(value) {
        value = resolveValue(this, this.setType, value, 'typeRA_');

        if (this.type !== value) {
            this.type = value;
            this.emit_typeChanged();
        }
    },
    setChecked: function(value) {
        value = resolveValue(this, this.setChecked, value, 'checkedRA_');

        if (this.checked !== value) {
            this.checked = value;
            this.emit_checkedChanged();
        }
    },
    setCounter: function(value) {
        value = resolveValue(this, this.setCounter, value, 'counterRA_');

        if (this.counter !== value) {
            this.counter = value;
            this.emit_counterChanged();
        }
    },
    setVisible: function(value) {
        value = resolveValue(this, this.setVisible, value, 'visibleRA_');

        if (this.visible !== value) {
            this.visible = value;
            this.emit_visibleChanged();
        }
    },
    destroy: function() {
        this.typeRA_ && resolveValue(this, null, null, 'typeRA_');
        this.checkedRA_ && resolveValue(this, null, null, 'checkedRA_');
        this.counterRA_ && resolveValue(this, null, null, 'counterRA_');
        this.visibleRA_ && resolveValue(this, null, null, 'visibleRA_');
        Node.prototype.destroy.call(this);
    }
});

module.exports = {
    Menu: Menu,
    MenuItem: MenuItem
};
