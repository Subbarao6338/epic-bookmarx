import { Button } from '@progress/kendo-react-buttons'
// import { DropDownList } from '@progress/kendo-react-dropdowns'
// import { Input, TextArea } from '@progress/kendo-react-inputs'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
// import { SaveButton, CancelButton } from '../../components/Buttons/buttons'
// import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { teamsForm, emailForm } from './Contactinputtypes'

function Contactinput() {
  const typeList = [
    {
      text: 'Microsoft Teams',
      value: 'teams',
      jsx: teamsForm,
    },
    {
      text: 'Email',
      value: 'email',
      jsx: emailForm,
    },
  ]

  const [typeForm, setTypeForm] = useState({ jsx: teamsForm })

  const handleTypeSelection = (e) => {
    console.log(e.target.value)
    setTypeForm({
      jsx: typeList.find(({ value }) => value === e.target.value).jsx,
    })
  }
  // const history = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const { data } = await axios.get(
      'http://localhost:8000/api/grafana/alertmanager/alerts/',
    )
    const { type, name, url, addresses } = Object.fromEntries(formData)
    data.alertmanager_config.receivers.push({
      name,
      grafana_managed_receiver_configs: [
        {
          settings: {
            url,
            addresses,
          },
          secureSettings: {},
          type,
          name,
          disableResolveMessage: false,
        },
      ],
    })

    const res = await axios.post(
      'http://localhost:8000/api/grafana/alertmanager/alerts/',
      data,
    )
    // window.alert(res.data.message)

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Contact point created successfully',

      showConfirmButton: false,
      timer: 1500,
    })
    window.location.replace('/Alert')
  }

  const handlecancel = () => {
    window.history.go(-1)
    // window.location.replace('/contact')
    //   history.push('/ContactPoint')
  }

  return (
    <div>
      <h5>Create Contact Point</h5>
      <hr />
      <form onSubmit={handleSubmit} style={{ width: 500 }}>
        <div className="m-2 row">
          <div className="col-3" style={{ width: 170 }}>
            <label>Contact Point Type:</label>
          </div>
          <div className="col-9" style={{ width: 300 }}>
            {/* <DropDownList
              name="type"
              data={[
                { text: 'Microsoft Teams', value: 'teams' },
                { text: 'Email', value: 'email' },
              ]}
              defaultValue={{ text: 'Microsoft Teams', value: 'teams' }}
              textField="text"
              valueMap={(value) => value.value}
              style={{ width: '100%' }}
              required
            /> */}
            <select
              name="type"
              // className="form-select"
              style={{ width: '100%', padding: 3, borderRadius: 4 }}
              required
              onChange={handleTypeSelection}
            >
              {typeList.map(({ text, value }) => (
                <option key={value} value={value}>
                  {text}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <typeForm.jsx />
        </div>

        <div className="m-3 text-center">
          <Button id="btn" type="submit">
            Save
          </Button>
          <Button
            id="btn"
            style={{ marginLeft: '10px' }}
            onClick={handlecancel}
            // type="reset"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Contactinput
