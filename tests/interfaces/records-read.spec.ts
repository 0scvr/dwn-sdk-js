import type { RecordsReadMessage } from '../../src/types/records-types.js';

import chaiAsPromised from 'chai-as-promised';
import chai, { expect } from 'chai';

import dexProtocolDefinition from '../vectors/protocol-definitions/dex.json' assert { type: 'json' };
import { getCurrentTimeInHighPrecision } from '../../src/utils/time.js';
import { Jws } from '../../src/index.js';
import { RecordsRead } from '../../src/interfaces/records-read.js';
import { TestDataGenerator } from '../utils/test-data-generator.js';

chai.use(chaiAsPromised);

describe('RecordsRead', () => {
  describe('create()', () => {
    it('should use `messageTimestamp` as is if given', async () => {
      const alice = await TestDataGenerator.generatePersona();

      const currentTime = getCurrentTimeInHighPrecision();
      const recordsRead = await RecordsRead.create({
        filter: {
          recordId: 'anything',
        },
        authorizationSigner : Jws.createSigner(alice),
        messageTimestamp    : currentTime
      });

      expect(recordsRead.message.descriptor.messageTimestamp).to.equal(currentTime);
    });

    it('should auto-normalize protocol URL', async () => {
      const alice = await TestDataGenerator.generatePersona();

      const options = {
        recipient           : alice.did,
        data                : TestDataGenerator.randomBytes(10),
        dataFormat          : 'application/json',
        authorizationSigner : Jws.createSigner(alice),
        filter              : { protocol: 'example.com/' },
        definition          : dexProtocolDefinition
      };
      const recordsQuery = await RecordsRead.create(options);

      const message = recordsQuery.message as RecordsReadMessage;

      expect(message.descriptor.filter!.protocol).to.eq('http://example.com');
    });

    it('should auto-normalize schema URL', async () => {
      const alice = await TestDataGenerator.generatePersona();

      const options = {
        recipient           : alice.did,
        data                : TestDataGenerator.randomBytes(10),
        dataFormat          : 'application/json',
        authorizationSigner : Jws.createSigner(alice),
        filter              : { schema: 'example.com/' },
        definition          : dexProtocolDefinition
      };
      const recordsQuery = await RecordsRead.create(options);

      const message = recordsQuery.message as RecordsReadMessage;

      expect(message.descriptor.filter!.schema).to.eq('http://example.com');
    });
  });
});

