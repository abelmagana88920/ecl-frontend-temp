const DUMMY = {
    //DATA-MANAGEMENT
    hubs: [
        {
            id: 1,
            code: 'AXQ',
            name: 'AXQ HUB',
            address:
                'DURIAN PARK, 124 DOMESTIC RD BARANGAY 191 PASAY METRO MANILA',
            updatedAt: new Date()
        },
        {
            id: 2,
            code: 'DBH',
            name: 'DB HUB',
            address:
                'HANGAR, GENERAL AVIATION AREA, MANILA DOMESTIC AIRPORT BARANGAY 191 PASAY CITY METRO MANILA',
            updatedAt: new Date()
        },
        {
            id: 3,
            code: 'DTN',
            name: 'DTN HUB',
            address:
                'KM 40 BANAWE DE STA.ROSA BLDG. F. REYES ST. PUROK 6 BRGY. BALIBAGO STA. ROSA, LAGUNA',
            updatedAt: new Date()
        },
        {
            id: 4,
            code: 'LCX',
            name: 'LCX HUB',
            address:
                '306, VVS BUILDING, MULTINATIONAL AVENUE, MULTINATIONAL VILLAGE MOONWALK PARAÑAQUE METRO MANILA',
            updatedAt: new Date()
        },
        {
            id: 5,
            code: 'MNL',
            name: 'MNL CORP',
            address:
                'HANGAR, GENERAL AVIATION AREA, MANILA DOMESTIC AIRPORT BARANGAY 191 PASAY CITY METRO MANILA',
            updatedAt: new Date()
        },
        {
            id: 6,
            code: 'OZH',
            name: 'OZH HUB',
            address: 'BLK3 LOT12 SOLDIERS HILLS BRGY. PUTATAN, MUNTINLUPA CITY',
            updatedAt: new Date()
        }
    ],
    users : {
        couriers : [
            { id: 0, username:'amadrid', firstName: 'Abel', lastName: ' Madrid', contact: '09879733958', zone: 'zone-001', vehicle: 'ABE 999', updatedAt: new Date() },
            { id: 1, username:'rmagana', firstName: 'Ruru', lastName: ' Magana', contact: '09567458568', zone: 'zone-002', vehicle: 'BEL 999', updatedAt: new Date() },
            { id: 2, username:'ldequina', firstName: 'Lester', lastName: ' Dequina', contact: '09456847884', zone: 'zone-003', vehicle: 'TER 783', updatedAt: new Date() },
            { id: 3, username:'mzabala', firstName: 'Marvin', lastName: ' Zabala', contact: '09568457933', zone: 'zone-004', vehicle: 'ABE 474', updatedAt: new Date() },
            { id: 4, username:'ctecson', firstName: 'Christasn', lastName: ' Tecson', contact: '09872927553', zone: 'zone-005', vehicle: 'ABE 463', updatedAt: new Date() },
            { id: 5, username:'gdiamante', firstName: 'Gabriel', lastName: ' Diamante', contact: '09327692734', zone: 'zone-006', vehicle: 'ABE 087', updatedAt: new Date() }
        ],
        courier_deliveries : [
            { 
                id:0, 
                airway_bill:'awb-001', 
                shipperName:'shipper-001', 
                cneeName :'cnee-001', 
                status:'successful', 
                checkin:new Date(), 
                checkout:new Date(),
                accountNumber :'',
                payMode :'',
                cod :'',
                totalCharge :'',
                shipperAddress :'',
                shipperContactNumber :'',
                cneeAddress :'',
                cneeContactNumber :'',
                receiverName :'',
                relationship :'',
                receiverID_TYPE :'',
                receiverID_NUMBER :'',
                shipperSignature :'',
                receiverSignature :'',
                receiverPicture :''
            },
            { 
                id:1, 
                airway_bill:'awb-002', 
                shipperName:'shipper-002', 
                cneeName :'cnee-002', 
                status:'failed', 
                checkin:new Date(), 
                checkout:new Date(),
                accountNumber :'',
                payMode :'',
                cod :'',
                totalCharge :'',
                shipperAddress :'',
                shipperContactNumber :'',
                cneeAddress :'',
                cneeContactNumber :'',
                receiverName :'',
                relationship :'',
                receiverID_TYPE :'',
                receiverID_NUMBER :'',
                shipperSignature :'',
                receiverSignature :'',
                receiverPicture :''
            },
            { 
                id:2, 
                airway_bill:'awb-003', 
                shipperName:'shipper-003', 
                cneeName :'cnee-003',  
                status:'successful', 
                checkin:new Date(), 
                checkout:new Date(),
                accountNumber :'',
                payMode :'',
                cod :'',
                totalCharge :'',
                shipperAddress :'',
                shipperContactNumber :'',
                cneeAddress :'',
                cneeContactNumber :'',
                receiverName :'',
                relationship :'',
                receiverID_TYPE :'',
                receiverID_NUMBER :'',
                shipperSignature :'',
                receiverSignature :'',
                receiverPicture :''
            },
            { 
                id:3, 
                airway_bill:'awb-004', 
                shipperName:'shipper-004', 
                cneeName :'cnee-004', 
                status:'failed', 
                checkin:new Date(), 
                checkout:new Date(), 
                accountNumber :'',
                payMode :'',
                cod :'',
                totalCharge :'',
                shipperAddress :'',
                shipperContactNumber :'',
                cneeAddress :'',
                cneeContactNumber :'',
                receiverName :'',
                relationship :'',
                receiverID_TYPE :'',
                receiverID_NUMBER :'',
                shipperSignature :'',
                receiverSignature :'',
                receiverPicture :''
            }
        ],
        courier_pickups : [
            { id:0, booking_code:'book-001', shipper:'shipper-001', consignee:'cnee-001', status:'successful', checkin:new Date(), checkout:new Date() },
            { id:1, booking_code:'book-002', shipper:'shipper-002', consignee:'cnee-002', status:'failed', checkin:new Date(), checkout:new Date() },
            { id:2, booking_code:'book-003', shipper:'shipper-003', consignee:'cnee-003', status:'successful', checkin:new Date(), checkout:new Date() },
            { id:3, booking_code:'book-004', shipper:'shipper-004', consignee:'cnee-004', status:'failed', checkin:new Date(), checkout:new Date() },
            { id:4, booking_code:'book-005', shipper:'shipper-005', consignee:'cnee-005', status:'failed', checkin:new Date(), checkout:new Date() },
            { id:5, booking_code:'book-006', shipper:'shipper-006', consignee:'cnee-006', status:'successful', checkin:new Date(), checkout:new Date() }
        ]
    }
};

export default DUMMY;
