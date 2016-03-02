import React from 'react';

const TableRow = React.createClass({
  propTypes: {
    onDestroy: React.PropTypes.func,
    onRowClick: React.PropTypes.func,
    record: React.PropTypes.object,
    prefixCls: React.PropTypes.string,
    expandIconColumnIndex: React.PropTypes.number,
  },

  getDefaultProps() {
    return {
      onRowClick() {},
      onDestroy() {},
      expandIconColumnIndex: 0,
    };
  },

  componentWillUnmount() {
    this.props.onDestroy(this.props.record);
  },

  render() {
    const props = this.props;
    const prefixCls = props.prefixCls;
    const columns = props.columns;
    const record = props.record;
    const index = props.index;
    const cells = [];
    const expanded = props.expanded;
    const expandable = props.expandable;
    const expandIconAsCell = props.expandIconAsCell;
    const indent = props.indent;
    const indentSize = props.indentSize;
    const needIndentSpaced = props.needIndentSpaced;
    const onRowClick = props.onRowClick;
    const expandIconColumnIndex = props.expandIconColumnIndex;

    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const colClassName = col.className || '';
      const render = col.render;
      let text = record[col.dataIndex];

      let expandIcon;
      let tdProps;
      let colSpan;
      let rowSpan;
      let notRender = false;

      if (expandable) {
        expandIcon = (
          <span className={`${prefixCls}-expand-icon ${prefixCls}-${expanded ? 'expanded' : 'collapsed'}`}
            onClick={props.onExpand.bind(null, !expanded, record)} />
        );
      } else if (needIndentSpaced) {
        expandIcon = <span className={`${prefixCls}-expand-icon ${prefixCls}-spaced`} />;
      }

      const isColumnHaveExpandIcon = expandIconAsCell ? false : (i === expandIconColumnIndex);

      if (expandIconAsCell && i === 0) {
        cells.push(
          <td className={`${prefixCls}-expand-icon-cell`}
            key="rc-table-expand-icon-cell">
            {expandIcon}
          </td>
        );
      }

      if (render) {
        text = render(text, record, index);

        if (text && Object.prototype.toString.call(text) === '[object Object]' && !React.isValidElement(text)) {
          tdProps = text.props || {};
          rowSpan = tdProps.rowSpan;
          colSpan = tdProps.colSpan;
          text = text.children;
        }
      }

      if (rowSpan === 0 || colSpan === 0) {
        notRender = true;
      }

      const indentText = (
        <span style={{paddingLeft: indentSize * indent + 'px'}}
          className={`${prefixCls}-indent indent-level-${indent}`} />
      );

      if (!notRender) {
        cells.push(
          <td key={col.key}
            colSpan={colSpan}
            rowSpan={rowSpan}
            className={colClassName}>
            {isColumnHaveExpandIcon ? indentText : null}
            {isColumnHaveExpandIcon ? expandIcon : null}
            {text}
          </td>
        );
      }
    }
    return (
      <tr onClick={onRowClick.bind(null, record, index)}
        className={`${prefixCls} ${props.className} ${prefixCls}-level-${indent}`}
        style={{display: props.visible ? '' : 'none'}}>
        {cells}
      </tr>
    );
  },
});

export default TableRow;