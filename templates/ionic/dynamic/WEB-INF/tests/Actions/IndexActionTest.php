<?php

/**
 * ${action.namespace}\IndexActionTest
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * PHP version 5
 *
 * @author  Tim Wagner <tw@appserver.io>
 * @license http://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 * @link    https://github.com/${composer.name}
 */

namespace ${action.namespace};

use ${util.namespace}\RequestKeys;

/**
 * Test implementation for the IndexAction class.
 *
 * @author  Tim Wagner <tw@appserver.io>
 * @license http://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 * @link    https://github.com/${composer.name}
 */
class IndexActionTest extends \PHPUnit_Framework_TestCase
{

    /**
     * The action instance we want to test.
     *
     * @var ${action.namespace}\IndexAction
     */
    protected $mockAction;

    /**
     * Initializes the action instance.
     *
     * @return void
     */
    protected function setUp()
    {
        // create a instance of the action we want to test
        $this->mockAction = $this->getMockBuilder('${action.namespace}\IndexAction')
                                 ->disableOriginalConstructor()
                                 ->getMock();
    }

    /**
     * Tests a successfull action invocation.
     *
     * @return void
     */
    public function testIndexAction()
    {

        // create a mock servlet request/response
        $mockServletRequest = $this->getMock('AppserverIo\Appserver\ServletEngine\Http\Request');
        $mockServletResponse = $this->getMock('AppserverIo\Appserver\ServletEngine\Http\Response');

        // test the action invocation
        $this->mockAction->indexAction($mockServletRequest, $mockServletResponse);
    }
}
