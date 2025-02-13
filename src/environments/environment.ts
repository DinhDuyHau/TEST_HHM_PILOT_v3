// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,

    //apiUrl: 'https://test-hhm-ketnoi.genbyte.net',
    apiUrl: 'http://localhost:5000',
    accountingUrl: 'http://test-hhm-ketoan.genbyte.net', // link 130
    // accountingUrl: 'http://hhm-qt.genbyte.net', // link 115


    //Khóa công khai của người nhận
    receiverPublicKey: `-----BEGIN PUBLIC KEY-----
    MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHyTiwTAOZtUqSMVNF3kzScCRdKj
    gF8W48gHiEZ/fjN3TFjQwQzwR4LuyJyeUZVPR7OufWHk5nXej+VioyHTMW5EZ6pD
    yvlGuWnOhK41dOA7aCzazEkqskA3psqVKTN5dbLEPDTXKYukZbz0XmegThKyIMru
    b+NCdxa1fDRlSRifAgMBAAE=
    -----END PUBLIC KEY-----`,

    //Khóa bí mật của người gửi
    senderPrivateKey: `-----BEGIN RSA PRIVATE KEY-----
    MIICXAIBAAKBgQDQOc4/7Oeqtz1i57FygAA9b1SY6G6rLJOT1kFOdSNasoih6aUV
    bjNTiZwl7OvlXsOB+dlVImhiB1rD1GwILDivikafavNRODDe90tWFBD87/QpHD3o
    7Hu0AsClFZRhns6GYgUT1sNC/ha5L9R9MiE9+H5+iVymBIHo2IjwUPqIbQIDAQAB
    AoGAHv5rt9IwjZWm2oD4Rb3Ny1c19WiriGkjMl8y61W+RHLMqaUYgH8dvrJ9/pss
    ZcDcQw2IjwaHGQhVN074IaNLcHjSjvxaOHbqWFqI44ERKBwNc/PC5qAl0cac+Pjk
    nGU7advd2pq8qhz/AJ4q1856RjRQ2GhWEE5rnYo5+399FqECQQDvWUtnWbDffA0Y
    ehydInPQkNMcJMjIjYwwnwDILvEuNDT61Jex+fMajxnlu3MPEUvcHPSeOUDQm23D
    a39IQk01AkEA3rY5F1RS0j4QOg7DX1kn9zi3nljVUgcJLxcuhwllyhHuVB5JRPQD
    ZkTlgtlmr/wdSpE6vR87aUfRIyQqvjoNWQJAAlZc5iV6FLShbBvFK8OqXd8MMLor
    O8omFFN5LntG36yi19A7qwFF3nyHRDcQaJVCqGOf/+uPNnpOGBp0o8ACAQJANeLf
    Q27Kr0YHBRUnXn2i9uVJQE38J2G+bh9syY2TjGX0RXQihEWKQQdwhM13VCNrLuye
    yr2w0VNoHdmVYfuH2QJBAMD1Ms32G3NNZi7jfKrTNo4vheHL4q6iQ9tD5qbXeul4
    pW3P8AtbBQp+HUuqhHmUju+8ngjoOY06cRrP2wMP0s4=
    -----END RSA PRIVATE KEY-----`,

    /* 
    //Khóa công khai của người gửi
    senderPublicKey: `-----BEGIN PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDQOc4/7Oeqtz1i57FygAA9b1SY
    6G6rLJOT1kFOdSNasoih6aUVbjNTiZwl7OvlXsOB+dlVImhiB1rD1GwILDivikaf
    avNRODDe90tWFBD87/QpHD3o7Hu0AsClFZRhns6GYgUT1sNC/ha5L9R9MiE9+H5+
    iVymBIHo2IjwUPqIbQIDAQAB
    -----END PUBLIC KEY-----`
    */
    firebaseConfig: {
        apiKey: 'AIzaSyCvLowDyeacumDN_1ZvPudSUnXlUTxMpbM',
        authDomain: 'hoanghamobile-genbyte.firebaseapp.com',
        projectId: 'hoanghamobile-genbyte',
        storageBucket: 'hoanghamobile-genbyte.appspot.com',
        messagingSenderId: '631018483609',
        appId: '1:631018483609:web:2ad56f451d132ebd806d08',
        measurementId: 'G-YMLVYF6NCQ'
    },
    licenseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJweW91LmNvbSIsInN1YiI6ImFkbWluQHB5b3UuY29tIiwiaWF0IjoxNjI4Mjk1MzYxLCJpc3MiOiJBZG1pbiIsImV4cCI6MTYyODI3NjM2MSwidmVyc2lvbiI6MSwiY2FwYWJpbGl0aWVzIjp7Im9mZmxpbmUiOnRydWUsImFuYWx5dGljc09wdE91dCI6dHJ1ZSwiY3VzdG9tT3ZlcmxheUxvZ28iOnRydWV9fQ.ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345678912345672312312sdsdsssda-'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
