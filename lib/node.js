import cx from 'classnames';
import React, { Component } from 'react';

class UITreeNode extends Component {
  constructor(props) {
    super(props);
    this.innerRef = React.createRef();
  }

  renderCollapse = () => {
    const { index } = this.props;

    if (index.children && index.children.length) {
      const { collapsed } = index.node;
      console.log('NODE: ', index);

      return (
        <span
          //className={cx('tree-node-collapse', collapsed ? 'caret-right' : 'caret-down')}
          className={'tree-node-collapse'}
          onMouseDown={e => e.stopPropagation()}
          onClick={this.handleCollapse}
        >
          <i className={cx('fas', collapsed ? 'fa-chevron-right' : 'fa-chevron-down')}></i>
        </span>
      );
    }

    return null;
  };

  renderChildren = () => {
    const { index, tree, dragging } = this.props;

    if (index.children && index.children.length) {
      const childrenStyles = {
        paddingLeft: this.props.paddingLeft
      };

      return (
        <div className="children" style={childrenStyles}>
          {index.children.map(child => {
            const childIndex = tree.getIndex(child);

            return (
              <UITreeNode
                tree={tree}
                index={childIndex}
                key={childIndex.id}
                dragging={dragging}
                paddingLeft={this.props.paddingLeft}
                onCollapse={this.props.onCollapse}
                onDragStart={this.props.onDragStart}
              />
            );
          })}
        </div>
      );
    }

    return null;
  };

  render() {
    const { tree, index, dragging } = this.props;
    const { node } = index;
    const styles = {};

    let nodeContent = [
      this.renderCollapse(),
      tree.renderNode(node)
    ];

    return (
      <div
        className={cx('m-node', {
          placeholder: index.id === dragging
        })}
        style={styles}
      >
        <div
          className="inner"
          ref={this.innerRef}
          onMouseDown={this.handleMouseDown}
        >
          {nodeContent}
        </div>
        {node.collapsed ? null : this.renderChildren()}
      </div>
    );
  }

  handleCollapse = e => {
    e.stopPropagation();
    const nodeId = this.props.index.id;

    if (this.props.onCollapse) {
      this.props.onCollapse(nodeId);
    }
  };

  handleMouseDown = e => {
    const nodeId = this.props.index.id;
    const dom = this.innerRef.current;

    if (this.props.onDragStart) {
      this.props.onDragStart(nodeId, dom, e);
    }
  };
}

module.exports = UITreeNode;
