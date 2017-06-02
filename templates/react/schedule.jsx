// For each course in the schedule that is selected
class ScheduleItem extends React.Component {
  handleCourseDel(courseCode){
    this.props.handleCourseDel(courseCode);
  }
  render() {
    var color = { backgroundColor: this.props.course.color }
    return (
      <div className='course-selected col-sm-6' style={ color }
        onClick={(e) => {
          e.stopPropagation();
          this.handleCourseDel(this.props.course.code);
        }}>
        { this.props.course.code }
      </div>
    )
  }
}

// The schedule that is to the right of the screen
class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.handleCourseDel = this.handleCourseDel.bind(this);
    this.state = {
      'clickStatus': {
        'p1b1': {'selected': 'unselected', 'checked': true},
        'p1b2': {'selected': 'unselected', 'checked': true},
        'p1b3': {'selected': 'unselected', 'checked': true},
        'p1b4': {'selected': 'unselected', 'checked': true},
        'p1none': {'selected': 'unselected', 'checked': true},
        'p2b1': {'selected': 'unselected', 'checked': true},
        'p2b2': {'selected': 'unselected', 'checked': true},
        'p2b3': {'selected': 'unselected', 'checked': true},
        'p2b4': {'selected': 'unselected', 'checked': true},
        'p2none': {'selected': 'unselected', 'checked': true},
      }
    }
  }
  handleCourseDel(code) {
    this.props.handleCourseDel(code);
  }

  handleBlockClick(slot) {
    this.props.handleBlockClick({
      'period': slot['period'],
      'block': slot['block'],
      'checked': this.state.clickStatus[slot['id']].checked,
    });

    var css = (this.state.clickStatus[slot['id']].selected === 'unselected') ? 'selected' : 'unselected';
    var new_clickStatus = this.state.clickStatus;
    new_clickStatus[slot['id']].selected = css;
    new_clickStatus[slot['id']].checked = ! this.state.clickStatus[slot['id']].checked;
    this.setState({
      'clickStatus': new_clickStatus
    });
  }

  handleCartSave() {
    var name = 'Kundis';
    var cookiestring = RegExp("cart[^;]+").exec(document.cookie);
    var cart =  unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "")
    const form = new FormData();

    {% if current_user.is_authenticated %}
      var user_id = {{ current_user.id }};
    {% else %}
      var user_id = 0;
    {% endif %}

    form.append("user_id", user_id);
    form.append("name", name);
    form.append("cart", cart);
    // On submit of the form, send a POST request with the data to the server.
    fetch('/user_cart', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user_id,
        name: name,
        cart: cart,
      })
    })
      .then(function(response) {
        console.log(response)
      }).then(function(body) {
        console.log(body);
      });
  }

  handleCartLoad(){
    if (this.props.loggedInCart.length > 1) {
      var cart = this.props.loggedInCart.split(',');
      this.props.handleCourseLoad(cart);
    }
  }

  // Place the courses in the correct slot
  render() {
    var p1b1 = [];
    var p1b2 = [];
    var p1b3 = [];
    var p1b4 = [];
    var p1none = [];

    var p2b1 = [];
    var p2b2 = [];
    var p2b3 = [];
    var p2b4 = [];
    var p2none = [];

    var codes = [];
    var courseItem;
    var c;

    var _this = this;
    this.props.courses.forEach(function(course) {
      courseItem = <ScheduleItem
        key={ course.code }
        handleCourseDel={ _this.handleCourseDel }
        course={ course }
      />
      codes.push(course.code);
      switch (course.block1) {
        case '1': p1b1.push(courseItem);    break;
        case '2': p1b2.push(courseItem);    break;
        case '3': p1b3.push(courseItem);    break;
        case '4': p1b4.push(courseItem);    break;
        case '-': p1none.push(courseItem);  break;
        default:
      }
      switch (course.block2) {
        case '1': p2b1.push(courseItem);    break;
        case '2': p2b2.push(courseItem);    break;
        case '3': p2b3.push(courseItem);    break;
        case '4': p2b4.push(courseItem);    break;
        case '-': p2none.push(courseItem);  break;
        default:
      }
    });

    var defaultClasses = "col-md-2 col-xs-2 light-grey noborder schedule-header"
    var slotClasses = "col-md-5 col-xs-5 block-box-container"

    return (
      <div className="schedule">
        <button className='btn-danger' onClick={() => {this.handleCourseDel('all')}}>
          Ta bort alla
        </button>
        <div className="row my-row schedule-header">
          <div className="col-md-2 col-xs-3 light-grey noborder">
            <h5>Block</h5>
          </div>
          <div className="col-md-5 col-xs-5 light-grey noborder">
            <h5>Period 1</h5>
          </div>
          <div className="col-md-5 col-xs-4 light-grey noborder">
            <h5>Period 2</h5>
          </div>
        </div>

        <div className="row my-row row-eq-height">
          <div className={ defaultClasses }>
            1
          </div>
          <div className={ slotClasses + ' ' + this.state.clickStatus['p1b1'].selected } onClick={() => {this.handleBlockClick({ 'period': '1', 'block': '1', 'id': 'p1b1'})}}>
            <div className="row select-row block-box">
              { p1b1 }
            </div>
          </div>
          <div className={ slotClasses + ' ' + this.state.clickStatus['p2b1'].selected} onClick={() => {this.handleBlockClick({ 'period': '2', 'block': '1', 'id': 'p2b1'})}}>
            <div className="row select-row block-box">
            { p2b1 }
          </div>
          </div>
        </div>


        <div className="row my-row row-eq-height">
          <div className={ defaultClasses }>
            2
          </div>
          <div className={ slotClasses + ' ' + this.state.clickStatus['p1b2'].selected } onClick={() => {this.handleBlockClick({ 'period': '1', 'block': '2', 'id': 'p1b2'})}}>
            <div className="row select-row block-box">
            { p1b2 }
          </div>
          </div>
          <div className={ slotClasses + ' ' + this.state.clickStatus['p2b2'].selected } onClick={() => {this.handleBlockClick({ 'period': '2', 'block': '2', 'id': 'p2b2'})}}>
            <div className="row select-row block-box">
            { p2b2 }
          </div>
          </div>
        </div>
        <div className="row my-row row-eq-height">
          <div className={ defaultClasses }>
            3
          </div>
          <div className={ slotClasses + ' ' + this.state.clickStatus['p1b3'].selected } onClick={() => {this.handleBlockClick({ 'period': '1', 'block': '3', 'id': 'p1b3'})}}>
            <div className="row select-row block-box">
            { p1b3 }
          </div>
          </div>
          <div className={ slotClasses + ' ' + this.state.clickStatus['p2b3'].selected } onClick={() => {this.handleBlockClick({ 'period': '2', 'block': '3', 'id': 'p2b3'})}}>
            <div className="row select-row block-box">
            { p2b3 }
          </div>
          </div>
        </div>
        <div className="row my-row row-eq-height">
          <div className={ defaultClasses }>
            4
          </div>
          <div className={ slotClasses + ' ' + this.state.clickStatus['p1b4'].selected } onClick={() => {this.handleBlockClick({ 'period': '1', 'block': '4', 'id': 'p1b4'})}}>
            <div className="row select-row block-box">
            { p1b4 }
          </div>
          </div>
          <div className={ slotClasses + ' ' + this.state.clickStatus['p2b4'].selected } onClick={() => {this.handleBlockClick({ 'period': '2', 'block': '4', 'id': 'p2b4'})}}>
            <div className="row select-row block-box">
            { p2b4 }
          </div>
          </div>
        </div>
        <div className="row my-row row-eq-height">
          <div className={ defaultClasses }>
            -
          </div>
          <div className={ slotClasses + ' ' + this.state.clickStatus['p1none'].selected } onClick={() => {this.handleBlockClick({ 'period': '1', 'block': '-', 'id': 'p1none'})}}>
            <div className="row select-row block-box">
            { p1none }
          </div>
          </div>
          <div className={ slotClasses + ' ' + this.state.clickStatus['p2none'].selected } onClick={() => {this.handleBlockClick({ 'period': '2', 'block': '-', 'id': 'p2none'})}}>
            <div className="row select-row block-box">
            { p2none }
          </div>
          </div>
        </div>

        <button className='btn-default' onClick={() => {this.handleCartSave()}}>
          Spara kurser
        </button>

        <button className='btn-default' onClick={() => {this.handleCartLoad()}}>
          Ladda kurser
        </button>
      </div>
    )
  }
}
