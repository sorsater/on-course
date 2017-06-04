// One element for each profile
class ProfileRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    var selected = 'unselected';
    if (props.default === true){
      selected = 'selected';
    }
    this.state = {
      'selected': selected,
      'checked': props.default,
    }
  }

  profileCheckbox() {
    this.props.onClick({
      'id': this.props.profile.id,
      'checked': !this.state.checked,
    });
    var css = (this.state.selected === 'unselected') ? 'selected' : 'unselected';
    this.setState({
      'selected': css,
      'checked': !this.state.checked
    });
  }

  handleChange(event) {}

  render() {
    return (
      <div
        className={ "col-sm-2 profileElement" + ' ' + this.state.selected }
        onClick={ this.profileCheckbox.bind(this) }
      >
        <input
          type="checkbox"
          name={ this.props.profile.id }
          checked={ this.state.checked }
          onChange={ this.handleChange }
        />
        { this.props.profile.name }
      </div>
    )
  }
}

// The checkboxes for the different profiles
class Profile extends React.Component {
  profileCheckbox(id) {
    this.props.profileCheckbox(id);
  }

  render() {
    var profileRows = [];
    var all_courses = {
      'id': -1,
      'name': 'Alla kurser',
    };

    profileRows.push(
      <ProfileRow
        key='all'
        profile={ all_courses }
        default={ true }
        onClick={ this.profileCheckbox.bind(this) }
      />
    );

    this.props.profiles.forEach((profile) => {
      profileRows.push(
        <ProfileRow
          key={ profile.id }
          default={ false }
          profile={ profile }
          onClick={ this.profileCheckbox.bind(this) }
        />
      );
    });
    return (
      <div className="profile-style select-row">
        <div className="row white">
          { profileRows }
        </div>
      </div>
    )
  }
};
