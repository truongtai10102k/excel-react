import logo from './logo.svg';
import './App.css';
import * as xlsx from 'xlsx';
import FileSaver from 'file-saver'
import { useState } from 'react'
import loadImg from "./public/a.gif"
function App() {
  const [isLoading, setIsLoading] = useState(false);

  const ExportCSV = (csvData, fileName) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = xlsx.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = xlsx.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    setIsLoading(false)
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  const handleFilter = (data) => {
    let dataArray = []
    dataArray.push(data[0]);
    data.map((item, idx) => {
      var flag = false;
      dataArray.map((i, idxx) => {
        if (JSON.stringify(i) === JSON.stringify(item)) {
          flag = true
        }
      })
      if (!flag) {
        dataArray.push(item)
      }
    })
    ExportCSV(dataArray, "excel")
  }
  const readFile = (file) => {
    setIsLoading(true)
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = xlsx.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = xlsx.utils.sheet_to_json(ws)
        resolve(data);
      }
      fileReader.onerror = ((error) => {
        reject(error);
      })
    })
    promise.then((d) => {
      return handleFilter(d)
    })
  }
  return (
    <div className="App">
      {
        isLoading === false ?
          <div>
            <div>Excel</div>
            <input type="file" onChange={(e) => {
              if (e.target.files[0]) {
                const file = e.target.files[0];
                console.log("hihi ", file);
                // reader file
                if (file.name.split('.').pop().toLowerCase() !== "xlsx") {
                  alert("chỉ hỗ trợ file excel")
                } else {
                  readFile(file);
                }
              }
            }} />
          </div>
          :
          <div>
            Đang Xử Lý. Đợi Tý Làm Gì Căng
          </div>
      }

    </div>
  );
}

export default App;
