### Table of Contents

- [Endpoints](#endpoints)
- [Error Responses](#error-responses)


### Endpoints

<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Url</th>
      <th>Header</th>
      <th>Body</th>
      <th>Response</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>POST</td>
      <td>/api/user</td>
      <td><pre>Content-Type: application/json</pre></td>
      <td>
<pre>
{
  googleIdToken: string
}
</pre>
      </td>
      <td>
<pre>
status: 200
body:
{
  userId: string,
  name: string,
  email: string,
  pfp: string
}
</pre>
or <em>status code 201</em> for a returning user. <br>
or <em>error code 400</em> for missing field 'googleIdToken'. <sup id='endpoints-footnote1-ref'><a href="#endpoints-footnote1" >1</a></sup>
      </td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/api/user</td>
      <td>        <pre>
Authorization: &lt;userId>
Content-Type: application/json
</pre></td>
      <td>-</td>
      <td><pre>status: 204</pre></td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/api/order</td>
      <td>
      <pre>
Authorization: &lt;userId>
Content-Type: application/json
</pre></td>
      <td>
      <pre>
{
  title: string
}
</pre></td>
      <td>
      <pre>
status: 201
</pre>
or <em>error code 400</em> for missing field 'title'
      </td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/api/orders</td>
      <td>
      <pre>
Authorization: &lt;userId>
Content-Type: application/json
</pre></td>
      <td>-</td>
      <td>
<pre>
status: 200
body:
[
  {
    "orderId": "string",
    "title": "string",
    "createdAt": "string",
    "deliveredAt": "string (optional)"
  }
]

</pre>
      </td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/api/orders/:id</td>
      <td>
      <pre>
Authorization: &lt;userId>
Content-Type: application/json
</pre></td>
      <td>-</td>
      <td>
<pre>
status: 204
</pre>
or <em>error code 404</em> for order not found
      </td>
    </tr>
  </tbody>
</table>
  <sup id="endpoints-footnote1"><a href="#endpoints-footnote1-ref">1</a></sup> check out section <em>Error Responses</em> for response format.

<div style="text-align: right"><br> <a href="#table-of-contents" style="font-size: 12px;">BACK TO TOP</a></div>

<div id="error-responses" style="position: absolute; top: -100px; visibility: hidden;"></div>

### Error Responses

All error responses are in the format:

```json
{
  error: string
}
```

| Status Code | error                  | Notes                                                                      |
| :---------: | ---------------------- | -------------------------------------------------------------------------- |
|     401     | Authorization failed.  | Does not apply to the POST /api/user routes as that is user creation/login |
|     500     | Internal server error. |

<div style="text-align: right"><br> <a href="#table-of-contents" style="font-size: 12px;">BACK TO TOP</a></div>
