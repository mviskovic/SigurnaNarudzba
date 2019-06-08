pragma solidity ^0.5.0;

contract SigurnaNarudzba {
    uint public brojacNarudzbi = 0;

    struct Narudzba {
        uint id;
        string opisNarudzbe;
        int stanjeNarudzbe;
        bool stanje;
    }

    mapping(uint => Narudzba) public narudzbe;

    event NarudzbaKreirana(
        uint id,
        string opisNarudzbe,
        int stanjeNarudzbe,
        bool stanje
    );

    event StanjeNarudzbe(
        uint id,
        int stanjeNarudzbe
    );

    function kreirajNarudzbu(string memory _opisNarudzbe) public {
        brojacNarudzbi ++;
        narudzbe[brojacNarudzbi] = Narudzba(brojacNarudzbi, _opisNarudzbe, 0, false);
        emit NarudzbaKreirana(brojacNarudzbi, _opisNarudzbe, 0, false);
    }

    function kolonaNarudzbe(uint _id) public {
       Narudzba memory _narudzba = narudzbe[_id];
       if(_narudzba.stanjeNarudzbe == 0) {
           _narudzba.stanjeNarudzbe = 1;
       }else if(_narudzba.stanjeNarudzbe == 1) {
           _narudzba.stanjeNarudzbe = 2;
       }
        narudzbe[_id] = _narudzba;
       emit StanjeNarudzbe(_id, _narudzba.stanjeNarudzbe);
    }
}