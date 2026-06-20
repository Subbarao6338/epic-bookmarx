import { Input, TextArea } from '@progress/kendo-react-inputs'
export const teamsForm = () => (
  <div>
    <div className="m-2 row">
      <div className="col-3" style={{ width: 170 }}>
        <label>Name:</label>
      </div>
      <div className="col-9" style={{ width: 300 }}>
        <Input
          name="name"
          placeholder="Contact Point Name"
          style={{ width: '100%' }}
          required
        />
      </div>
    </div>

    <div className="m-2 row" id="teams">
      <div className="col-3" style={{ width: 170 }}>
        <label>URL:</label>
      </div>
      <div className="col-9" style={{ width: 300 }}>
        <TextArea
          name="url"
          placeholder=" Teams Incoming Webhook URL"
          style={{ width: '100%' }}
          required
        />
      </div>
    </div>
  </div>
)

export const emailForm = () => (
  <div>
    <div className="m-2 row">
      <div className="col-3" style={{ width: 170 }}>
        <label>Name:</label>
      </div>
      <div className="col-9" style={{ width: 300 }}>
        <Input
          name="name"
          placeholder="Contact Point Name"
          style={{ width: '100%' }}
          required
        />
      </div>
    </div>

    <div className="m-2 row" id="mail">
      <div className="col-3" style={{ width: 170 }}>
        <label>Email:</label>
      </div>
      <div className="col-9" style={{ width: 300 }}>
        <TextArea
          name="addresses"
          placeholder="Email Addresses Separated by ';'"
          style={{ width: '100%' }}
          required
        />
      </div>
    </div>
  </div>
)
