const mysql = require("../database/mysql");
const moment = require("moment-timezone");
const { format, subHours } = require('date-fns');

module.exports = {
  volumeGetAll: async (request, response) => {
    try {
      const { data } = request.query;
  
      let query = "SELECT * FROM volume order by dataHora desc";
  
      if (data) {
        if (!moment(data, "YYYY-MM-DD", true).isValid()) {
          return response
            .status(400)
            .json({ message: 'Data inválida. Use o formato "YYYY-MM-DD".' });
        }
  
        const startOfDay = moment(data)
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss");
        const endOfDay = moment(data)
          .endOf("day")
          .format("YYYY-MM-DD HH:mm:ss");
  
        query += ` WHERE DataHora >= '${startOfDay}' AND DataHora <= '${endOfDay}'`;
      }
  
      const [result] = await mysql.execute(query);
  
      const resultWithSeparateDateTime = result.map((item) => {
        const dateMinusOneHour = subHours(item.DataHora, 1);
        return {
          ...item,
          Data: format(dateMinusOneHour, 'dd/MM/yyyy'),
          Hora: format(dateMinusOneHour, 'HH:mm:ss'),
        };
      });

      return response.status(200).json(resultWithSeparateDateTime);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  
  postVolume: async (req, res) => {
    try {
      const { distancia }  = req.body;

      distancias = parseFloat(distancia)

      console.log(distancias);

      const raio = 0.5;
      const altura = 4.0;

      const distanciaEmMetros = distancias / 100;

      const alturAgua = altura - distanciaEmMetros;

      const volume = Math.PI * Math.pow(raio, 2) * alturAgua * 100;

      const query =
        "INSERT INTO volume (volume, DataHora, temperatura) VALUES (?, NOW(), 30)";
      await mysql.execute(query, [volume]);

      res.status(200).json({ message: "Dados inseridos com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  },
};
