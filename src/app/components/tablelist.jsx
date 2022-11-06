import React, {useEffect,  useState  } from 'react';
import { Form } from 'react-bootstrap';
import MapboxC from './mapbox';
import {useFormik} from 'formik';

const validateForm = empData => {
  const errors = {};
  if (!empData.zipCode) {
    errors.zipCode = 'Please Enter your Zipcode';
  } else if (empData.zipCode.length !== 5) {
    // console.log(isNaN(empData.zipCode));
    errors.zipCode = 'Invalid Zip code';
  } else if(isNaN(empData.zipCode)){
    errors.zipCode = 'Invalid Zip code'
  }

  return errors;
};

const formatCategory = (categoryString) =>{
  var category = [];
  let delimiter = 0;
  for (let indexCategory = 0; indexCategory < categoryString.length; indexCategory++) {
    if(categoryString[indexCategory]===','){
      category.push(categoryString.substring(delimiter, indexCategory+1)+' ');
      delimiter = indexCategory+1;
    }
  }
    return category;
}

const TableList = () => {


  const clientID = "4759"
  const apikey = "d336da0a-0238-4ad3-a0d6-3ca4c34ab661"

  const prepareMap = (data) => {
    // console.log('prepareMap ->', data);
    let resultList = data['ResultList'];
    var arrayInfo = [];
    var arrayMap = [];
    for (let index = 0; index < resultList.length; index++) {
      const locationName = resultList[index]['Name'];
      const Address = resultList[index]['Address1'] +'. '+resultList[index]['PostCode'] +' '+resultList[index]['State'] + ' '+resultList[index]['CountryName'];
      const phone = resultList[index]['PhoneNumber'];
      const url = resultList[index]['URL'];
      const lat = resultList[index]['Latitude'];
      const lon = resultList[index]['Longitude'];
      const category = resultList[index]['CategoryNames'];
      const email = resultList[index]['EmailAddress'];
      const contactName = resultList[index]['ContactName'];
      const distance = resultList[index]['Distance'];
      
      arrayInfo.push([locationName, Address, phone, url, lat, lon, category, email, contactName, distance]);
      arrayMap.push([[lon, lat], [locationName, Address, phone]]);
    }
    // console.log('Array ready ->', arrayInfo);
    setInfoMap(arrayInfo);
    setDataMap(arrayMap);
    setDataMap([]);
  }

  const formik=useFormik({
    initialValues:{
      CountryID : 1,
      zipCode:'',
      radius:5
    },
    validate:validateForm,
    onSubmit:values=>{
      // console.log(values);
      const fetchInfo = async() => {
        try{
          await fetch('https://ws.bullseyelocations-staging.com/RestSearch.svc/DoSearch2?clientid='+clientID+'&apikey='+apikey+'&countryid='+values.CountryID+'&PostalCode='+values.zipCode+'&PageSize=50&radius='+values.radius+'')
            .then(results => results.json())
            .then(data => {
              // console.log('result ->', data);
              prepareMap(data);
              })
        }catch(error){
          // console.log("Error trying to connect with API!");
        }
      }
      fetchInfo();

    }
  });



  const [type, setType] = useState("5");
  const [valueRatio, setRatio] = useState([5, 10, 30, 50, 100]);

  const [dataMap, setDataMap] = useState([]);

  const [countryList, setCountryList] = useState([]);
  const [infoMap, setInfoMap] = useState([]);

  useEffect(() => {
    fetchDataCountry();
  }, []);

  const fetchDataCountry = async() => {
    try{
      await fetch('https://ws.bullseyelocations-staging.com/RestSearch.svc/GetCountryList?clientId='+clientID+'&apikey='+apikey+'')
        .then(results => results.json())
        .then(data => {
          // console.log('FetcjDataCountry', data);
          setCountryList(data)})
    }catch(error){
      // console.log("Error trying to connect with API!");
    }
  }

 
    return (
      <div>
        <div className="page-header">
        <h3 className="page-title"> Search for a location near you! </h3>
        </div>
        <div className="row">
          <div className="col-md-4 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Please provide some information</h4>
                <form onSubmit={formik.handleSubmit}>
                  <Form.Group>
                    <label htmlFor="user-country">Country</label>
                    <Form.Control as="select" name="CountryID" id="CountryID" multiple={false} onChange={e => {
                                                                            // console.log("e.target.value", e.target.value);
                                                                            formik.values.CountryID = e.target.value;
                                                                            setType(e.target.value);
                                                                            }}>
                    {countryList.map(country => 
                          <option key={country.Id} value={country.Id}>{country.Name}</option>
                       
                      )}
                      </Form.Control>
                  </Form.Group>


                  <Form.Group>
                    <label htmlFor="user-zipcode">City & State OR Zip Code</label>
                    <Form.Control type="text" name="zipCode" id="zipCode" value={formik.values.zipCode}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                       {formik.touched.zipCode && formik.errors.zipCode ? <span style={{color:'red'}}>{formik.errors.zipCode}</span> : null}
                  </Form.Group>

                  <Form.Group>
                    <label htmlFor="user-radius">Radius</label>
                    <Form.Control as="select" multiple={false} value={valueRatio.value} onChange={e => {
                                                                            // console.log("e.target.value", e.target.value);
                                                                            formik.values.radius = e.target.value;
                                                                            setType(e.target.value);
                                                                            }}>
                     {valueRatio.map(optionsRatio =>
                          <option key={optionsRatio} value={optionsRatio}>{optionsRatio}</option>
                        )}
                       </Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="user-teachername">Teacher Name</label>
                    <Form.Control type="text" className="form-control" id="user-teachername"/>
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="user-instrument">Instrument</label>
                    <Form.Control type="text" className="form-control" id="user-instrument"/>
                  </Form.Group>


                  <button type="submit" className="btn btn-primary mr-2">Search</button>
                </form>
                <hr /> 
                <div className="scrollable-list">
                  {infoMap.map(dataMap => 
                                      <div className="item-list" key={dataMap[0]}>
                                      <div className="row row-data">
                                        <div className="col-md-6 left-info">
                                          <b>{dataMap[0]}</b>
                                          <hr />
                                          <p className='address-detail'>{dataMap[1]}</p>
                                          <p className='address-detail'><b>Categories:</b> {formatCategory(dataMap[6])}</p>
                                          <p className='phone-contact'><a href={"tel:"+dataMap[2]}> <i className="mdi mdi-phone"></i> Call</a></p>
                                          <p className='links-info'><a href={dataMap[3]}>Go to website</a> | <a href={"https://www.google.com/maps/dir//"+dataMap[4]+","+dataMap[5]}target="_blank">Directions</a></p>
                                        </div>
                                        <div className="col-md-6 right-info">
                                        <p className='distance'>{dataMap[9]+' Miles'}</p>
                                        <a href={"mailto:"+dataMap[7]} ><i className="mdi mdi-contact-mail"></i> Send Email to {dataMap[0]}</a>
                                        {/* <p className='distance'><a href="#">Contact Teacher</a></p> */}
                                        </div>
                  
                                      </div>
                                    </div>
                    )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Showing location</h4>
                 <MapboxC values={dataMap}/>
              </div>
            </div>
            </div>
        </div>
        </div>
    )
  }

export default TableList
