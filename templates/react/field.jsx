// One row for each field
class FieldRow extends React.Component {
  render() {
    return(
      <option value={ this.props.field.id }>
        { this.props.field.name }
      </option>
    )
  }
}

// Select the different fields
class Field extends React.Component {
  onChange(event) {
    this.props.onChange(event.target.value);
  }
  render() {
    var allFields = {
      'id': -1,
      'name': 'Alla områden',
    };

    var fieldRows = []
    fieldRows.push(
      <FieldRow
        key={ -1 }
        field={ allFields }
      />
    );
    this.props.fields.forEach((field) => {
      fieldRows.push(
        <FieldRow
          key={ field.id }
          field={ field }
        />
      );
    });
    return (
      <select onChange={ this.onChange.bind(this) }>
        { fieldRows }
      </select>
    )
  }
}
