import '../App.css';
import {Link} from 'react-router-dom';

function Error() {
 
  return (
      <div className="App">
        <div className="success">
            <h1>Sorry About that</h1>
            <p>We seem to have lost you there</p>
            <p>This page does not exist</p>
            <p>No worries you can</p>
            <h3><Link to='/'>Go Back</Link></h3>
        </div>
      </div>
  );
}

export default Error;